// Server defaults come from the nearest .env (local) or Vercel environment variables (hosted).
// Each request may carry the user's own settings; nothing is stored between requests.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HttpError } from './errors.js';

const here = path.dirname(fileURLToPath(import.meta.url));
export const APP_DIR = path.resolve(here, '../..');

// Prefer the authoritative template in ../01_plan; fall back to the bundled copy (used on Vercel).
const SOURCE_TEMPLATE = path.resolve(APP_DIR, '../01_plan/TestPlan_Template.md');
export const BUNDLED_TEMPLATE = path.join(here, 'TestPlan_Template.md');
export const TEMPLATE_PATH = process.env.TEMPLATE_PATH || (fs.existsSync(SOURCE_TEMPLATE) ? SOURCE_TEMPLATE : BUNDLED_TEMPLATE);

export function findEnvFile(startDir) {
  let dir = startDir;
  while (true) {
    const file = path.join(dir, '.env');
    if (fs.existsSync(file)) return file;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

export const ENV_FILE = process.env.ENV_FILE || findEnvFile(APP_DIR);
if (ENV_FILE) process.loadEnvFile(ENV_FILE);

const trimUrl = (u) => (u || '').trim().replace(/\/+$/, '');
const env = process.env;

export const serverDefaults = Object.freeze({
  jiraBaseUrl: trimUrl(env.JIRA_BASE_URL),
  jiraEmail: env.JIRA_EMAIL || '',
  jiraToken: env.JIRA_TOKEN || '',
  groqApiKey: env.GROQ_API_KEY || '',
  groqModel: env.GROQ_MODEL || 'openai/gpt-oss-120b',
  ollamaUrl: trimUrl(env.OLLAMA_URL || 'http://localhost:11434'),
  ollamaModel: env.OLLAMA_MODEL || 'llama3.1',
  provider: env.LLM_PROVIDER || (env.GROQ_API_KEY ? 'groq' : 'ollama'),
});

const JIRA_URL_RE = /^https:\/\/[a-z0-9-]+\.atlassian\.net$/i;

// Build the settings for one request. The server's Jira token is only ever used
// with the server's own Jira URL and email, never with user-supplied ones.
export function resolveSettings(input, defaults = serverDefaults) {
  const v = (k) => (input && typeof input[k] === 'string' ? input[k].trim() : '');
  const s = { ...defaults };

  if (v('jiraToken')) {
    s.jiraBaseUrl = trimUrl(v('jiraBaseUrl'));
    s.jiraEmail = v('jiraEmail');
    s.jiraToken = v('jiraToken');
    if (s.jiraBaseUrl && !JIRA_URL_RE.test(s.jiraBaseUrl)) {
      throw new HttpError(400, 'Jira URL must look like https://your-domain.atlassian.net (Jira Cloud).');
    }
  } else if ((v('jiraBaseUrl') && trimUrl(v('jiraBaseUrl')) !== defaults.jiraBaseUrl) || (v('jiraEmail') && v('jiraEmail') !== defaults.jiraEmail)) {
    throw new HttpError(400, 'You changed the Jira URL or email, so enter the matching Jira API token too.');
  }

  if (v('groqApiKey')) s.groqApiKey = v('groqApiKey');
  if (v('groqModel')) s.groqModel = v('groqModel');
  if (v('ollamaUrl')) s.ollamaUrl = trimUrl(v('ollamaUrl'));
  if (v('ollamaModel')) s.ollamaModel = v('ollamaModel');
  if (['groq', 'ollama'].includes(v('provider'))) s.provider = v('provider');
  s.usingServerJira = !v('jiraToken');
  return s;
}

const maskEmail = (e) => (e ? e.replace(/^(.).*(@.*)$/, '$1***$2') : '');
const maskHost = (u) => (u ? u.replace(/^https:\/\/(.).*?(\.atlassian\.net)$/, 'https://$1***$2') : '');

// Safe view of the server defaults for the browser: masked identity, no secrets.
export function publicDefaults(s = serverDefaults) {
  return {
    jiraBaseUrlHint: maskHost(s.jiraBaseUrl),
    jiraEmailHint: maskEmail(s.jiraEmail),
    jiraTokenSet: Boolean(s.jiraToken),
    groqApiKeySet: Boolean(s.groqApiKey),
    groqModel: s.groqModel,
    ollamaUrl: s.ollamaUrl,
    ollamaModel: s.ollamaModel,
    provider: s.provider,
  };
}
