// LLM providers: Groq (OpenAI-compatible API) and local Ollama.
// Deterministic settings: temperature 0 and a fixed seed.
import { HttpError } from './errors.js';

const GROQ = 'https://api.groq.com/openai/v1';
const SEED = 42;

// The hosted app runs on Vercel, so it cannot reach a user's localhost/private Ollama.
const PRIVATE_HOST = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.0\.0\.0|\[?::1\]?$)/i;
function checkOllamaUrl(url) {
  let u;
  try { u = new URL(url); } catch { throw new HttpError(400, 'Ollama URL is not a valid URL.'); }
  if (!/^https?:$/.test(u.protocol)) throw new HttpError(400, 'Ollama URL must start with http:// or https://.');
  if (process.env.VERCEL && PRIVATE_HOST.test(u.hostname)) {
    throw new HttpError(400, 'The hosted app cannot reach a local Ollama. Use a public Ollama URL, choose Groq.com, or run the app locally.');
  }
}

async function call(url, init, label) {
  try {
    return await fetch(url, init);
  } catch (e) {
    const timedOut = e?.name === 'TimeoutError';
    throw new HttpError(502, timedOut ? `${label} timed out.` : `Could not reach ${label}.`);
  }
}

function providerError(res, label) {
  if (res.status === 401 || res.status === 403) return new HttpError(401, `${label} rejected the API key.`);
  if (res.status === 404) return new HttpError(502, `${label}: model or endpoint not found.`);
  if (res.status === 429) return new HttpError(429, `${label} rate limit reached. Try again shortly.`);
  return new HttpError(502, `${label} returned an error (HTTP ${res.status}).`);
}

export async function testLlm(s, provider) {
  if (provider === 'groq') {
    if (!s.groqApiKey) throw new HttpError(400, 'Groq API key is not set.');
    const res = await call(`${GROQ}/models`, {
      headers: { Authorization: `Bearer ${s.groqApiKey}` },
      signal: AbortSignal.timeout(15000),
    }, 'Groq.com');
    if (!res.ok) throw providerError(res, 'Groq.com');
    const ids = ((await res.json()).data || []).map((m) => m.id);
    const ok = ids.includes(s.groqModel);
    return `Connected to Groq.com. Model ${s.groqModel} is ${ok ? 'available' : 'NOT available on this key'}.`;
  }
  if (!s.ollamaUrl) throw new HttpError(400, 'Ollama URL is not set.');
  checkOllamaUrl(s.ollamaUrl);
  const res = await call(`${s.ollamaUrl}/api/tags`, { signal: AbortSignal.timeout(5000) }, `Ollama at ${s.ollamaUrl}`);
  if (!res.ok) throw providerError(res, 'Ollama');
  const names = ((await res.json()).models || []).map((m) => m.name);
  const ok = names.some((n) => n === s.ollamaModel || n.startsWith(`${s.ollamaModel}:`));
  return `Connected to Ollama. Model ${s.ollamaModel} is ${ok ? 'installed' : 'NOT installed (run: ollama pull ' + s.ollamaModel + ')'}.`;
}

export async function chat(s, messages) {
  if (s.provider === 'groq') {
    if (!s.groqApiKey) throw new HttpError(400, 'Groq API key is not set. Add GROQ_API_KEY or switch to Ollama in Settings.');
    const res = await call(`${GROQ}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${s.groqApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: s.groqModel, messages, temperature: 0, seed: SEED }),
      signal: AbortSignal.timeout(120000),
    }, 'Groq.com');
    if (!res.ok) throw providerError(res, 'Groq.com');
    const text = (await res.json()).choices?.[0]?.message?.content;
    if (!text) throw new HttpError(502, 'Groq.com returned an empty response.');
    return { text, model: s.groqModel };
  }
  checkOllamaUrl(s.ollamaUrl);
  const res = await call(`${s.ollamaUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: s.ollamaModel, messages, stream: false, options: { temperature: 0, seed: SEED } }),
    signal: AbortSignal.timeout(300000),
  }, `Ollama at ${s.ollamaUrl}`);
  if (!res.ok) throw providerError(res, 'Ollama');
  const text = (await res.json()).message?.content;
  if (!text) throw new HttpError(502, 'Ollama returned an empty response.');
  return { text, model: s.ollamaModel };
}
