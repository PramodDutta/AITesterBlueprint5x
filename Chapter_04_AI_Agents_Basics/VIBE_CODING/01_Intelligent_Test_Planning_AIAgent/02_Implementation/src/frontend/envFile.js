// Parses .env text in the browser. Nothing is uploaded or stored; values go into React state.
// User settings live only in this tab's memory (never in browser storage) and are
// sent with each API request. Blank fields fall back to the server defaults.
export const EMPTY_CONFIG = {
  jiraBaseUrl: '', jiraEmail: '', jiraToken: '',
  groqApiKey: '', groqModel: '', ollamaUrl: '', ollamaModel: '', provider: '',
};

const KEY_MAP = {
  JIRA_BASE_URL: 'jiraBaseUrl',
  JIRA_URL: 'jiraBaseUrl',
  JIRA_EMAIL: 'jiraEmail',
  JIRA_TOKEN: 'jiraToken',
  JIRA_API_TOKEN: 'jiraToken',
  GROQ_API_KEY: 'groqApiKey',
  GROQ_MODEL: 'groqModel',
  OLLAMA_URL: 'ollamaUrl',
  OLLAMA_MODEL: 'ollamaModel',
  LLM_PROVIDER: 'provider',
};

export function parseEnv(text) {
  const values = {};
  const loaded = [];
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.trim().replace(/^export\s+/, '');
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 1) continue;
    const name = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1);
    else value = value.replace(/\s+#.*$/, '');
    const field = KEY_MAP[name];
    if (field && value) {
      values[field] = field === 'provider' ? value.toLowerCase() : value;
      loaded.push(name);
    }
  }
  return { values, loaded };
}
