// Express API. Used by src/backend/start.js (local) and api/index.js (Vercel).
// Stateless: every request carries its own `config`; nothing is stored server-side.
import fs from 'node:fs/promises';
import express from 'express';
import { TEMPLATE_PATH, publicDefaults, resolveSettings } from './config.js';
import { HttpError } from './errors.js';
import { fetchIssue, testJira } from './jira.js';
import { chat, testLlm } from './llm.js';
import { buildMessages, checkSections, cleanOutput } from './prompt.js';

const route = (fn) => async (req, res, next) => {
  try { res.json(await fn(req)); } catch (e) { next(e); }
};

export function createApp() {
  const app = express();
  app.use(express.json({ limit: '50kb' }));

  app.get('/api/settings', route(async () => publicDefaults()));

  app.post('/api/test/jira', route(async (req) => ({ message: await testJira(resolveSettings(req.body?.config)) })));

  app.post('/api/test/llm', route(async (req) => {
    const target = req.body?.target === 'ollama' ? 'ollama' : 'groq';
    return { message: await testLlm(resolveSettings(req.body?.config), target) };
  }));

  app.post('/api/generate', route(async (req) => {
    const s = resolveSettings(req.body?.config);
    const issue = await fetchIssue(s, req.body?.issueKey);
    let template;
    try { template = await fs.readFile(TEMPLATE_PATH, 'utf8'); } catch {
      throw new HttpError(500, 'Test plan template not found on the server.');
    }
    const { text, model } = await chat(s, buildMessages(template, issue));
    const plan = cleanOutput(text);
    return {
      plan,
      warnings: checkSections(template, plan).map((h) => `Section missing or out of order: ${h}`),
      source: { key: issue.key, url: issue.url, summary: issue.summary, status: issue.status, issueType: issue.issueType },
      provider: s.provider,
      model,
      generatedAt: new Date().toISOString(),
    };
  }));

  app.use('/api', (_req, _res, next) => next(new HttpError(404, 'Unknown API route.')));

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    const known = err instanceof HttpError || err.type === 'entity.parse.failed';
    if (!known) console.error('Unexpected error:', err.message);
    res.status(err.status || 500).json({ error: known ? err.message : 'Unexpected server error.' });
  });
  return app;
}
