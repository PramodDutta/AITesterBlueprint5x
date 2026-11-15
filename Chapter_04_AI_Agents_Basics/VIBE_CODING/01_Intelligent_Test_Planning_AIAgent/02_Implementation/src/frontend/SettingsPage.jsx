import React, { useEffect, useState } from 'react';
import { api } from './api.js';
import { EMPTY_CONFIG, parseEnv } from './envFile.js';

function Msg({ status }) {
  return status ? <p className={status.ok ? 'ok' : 'error'} role="status">{status.msg}</p> : null;
}

export default function SettingsPage({ config, setConfig }) {
  const [defaults, setDefaults] = useState(null);
  const [status, setStatus] = useState({});
  const [busy, setBusy] = useState('');
  const [envText, setEnvText] = useState('');

  useEffect(() => {
    api('/api/settings').then(setDefaults).catch((e) => setStatus({ page: { ok: false, msg: e.message } }));
  }, []);

  const set = (k) => (e) => setConfig({ ...config, [k]: e.target.value });
  const provider = config.provider || defaults?.provider || 'groq';

  async function run(id, path, body) {
    setBusy(id);
    setStatus((s) => ({ ...s, [id]: null }));
    try {
      const data = await api(path, { ...body, config });
      setStatus((s) => ({ ...s, [id]: { ok: true, msg: data.message } }));
    } catch (e) {
      setStatus((s) => ({ ...s, [id]: { ok: false, msg: e.message } }));
    } finally {
      setBusy('');
    }
  }

  function applyEnv(text) {
    const { values, loaded } = parseEnv(text);
    if (!loaded.length) {
      setStatus((s) => ({ ...s, env: { ok: false, msg: 'No supported keys found (e.g. JIRA_BASE_URL, JIRA_EMAIL, JIRA_TOKEN, GROQ_API_KEY).' } }));
      return;
    }
    setConfig({ ...config, ...values });
    setEnvText('');
    setStatus((s) => ({ ...s, env: { ok: true, msg: `Loaded: ${loaded.join(', ')}` } }));
  }

  function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 20000) {
      setStatus((s) => ({ ...s, env: { ok: false, msg: 'That file is too large to be a .env file.' } }));
      return;
    }
    file.text().then(applyEnv);
  }

  if (!defaults) return <main className="page"><h1 className="title">Settings</h1><p className="state">Loading…</p><Msg status={status.page} /></main>;

  const hint = (value, fallback) => (value ? `Server default: ${value}` : fallback);
  const secretHint = (isSet) => (isSet ? 'Server default is set (leave blank to use it)' : 'Required');

  return (
    <main className="page">
      <h1 className="title">Settings</h1>

      <section className="box card">
        <h2>Load from .env file</h2>
        <p className="note">Paste your .env or pick the file. It is read in this browser only, kept in memory for this tab, and cleared on refresh.</p>
        <textarea
          aria-label=".env contents"
          rows={4}
          spellCheck={false}
          autoComplete="off"
          placeholder={'JIRA_BASE_URL=https://your-domain.atlassian.net\nJIRA_EMAIL=you@example.com\nJIRA_TOKEN=...\nGROQ_API_KEY=...'}
          value={envText}
          onChange={(e) => setEnvText(e.target.value)}
        />
        <div className="row">
          <button disabled={!envText.trim()} onClick={() => applyEnv(envText)}>Apply pasted .env</button>
          <label className="filebtn">Choose .env file<input type="file" onChange={onFile} hidden /></label>
          <button onClick={() => { setConfig(EMPTY_CONFIG); setStatus({}); }}>Clear (use server defaults)</button>
        </div>
        <Msg status={status.env} />
      </section>

      <section className="box card">
        <h2>JIRA Connection</h2>
        <label>Token<input type="password" autoComplete="off" value={config.jiraToken} onChange={set('jiraToken')} placeholder={secretHint(defaults.jiraTokenSet)} /></label>
        <label>Email<input type="email" value={config.jiraEmail} onChange={set('jiraEmail')} placeholder={hint(defaults.jiraEmailHint, 'you@example.com')} /></label>
        <label>URL<input type="url" value={config.jiraBaseUrl} onChange={set('jiraBaseUrl')} placeholder={hint(defaults.jiraBaseUrlHint, 'https://your-domain.atlassian.net')} /></label>
        <p className="note">To use your own Jira, enter all three fields.</p>
        <div className="row">
          <button disabled={!!busy} onClick={() => run('jira', '/api/test/jira', {})}>{busy === 'jira' ? 'Testing…' : 'Test Connection'}</button>
        </div>
        <Msg status={status.jira} />
      </section>

      <section className="box card">
        <h2>LLM Configuration</h2>
        <ol>
          <li>
            <label className="radio"><input type="radio" name="provider" checked={provider === 'ollama'} onChange={() => setConfig({ ...config, provider: 'ollama' })} /> Ollama Connection</label>
            <input type="url" value={config.ollamaUrl} onChange={set('ollamaUrl')} aria-label="Ollama URL" placeholder={hint(defaults.ollamaUrl, 'http://localhost:11434')} />
            <small>Model: {config.ollamaModel || defaults.ollamaModel}</small>
          </li>
          <li>
            <label className="radio"><input type="radio" name="provider" checked={provider === 'groq'} onChange={() => setConfig({ ...config, provider: 'groq' })} />
              {' '}<a href="https://console.groq.com/keys" target="_blank" rel="noreferrer">↗ Groq.com</a> (API key)</label>
            <input type="password" autoComplete="off" value={config.groqApiKey} onChange={set('groqApiKey')} aria-label="Groq API key" placeholder={secretHint(defaults.groqApiKeySet)} />
            <small>Model: {config.groqModel || defaults.groqModel}</small>
          </li>
        </ol>
        <div className="row">
          <button disabled={!!busy} onClick={() => run('llm', '/api/test/llm', { target: 'ollama' })}>{busy === 'llm' ? 'Testing…' : 'Test Local LLM'}</button>
          <button disabled={!!busy} onClick={() => run('llm', '/api/test/llm', { target: 'groq' })}>{busy === 'llm' ? 'Testing…' : 'Test Groq.com'}</button>
        </div>
        <Msg status={status.llm} />
      </section>

      <p className="note">Changes apply immediately to this tab only. Secrets are never stored in the browser or on the server.</p>
    </main>
  );
}
