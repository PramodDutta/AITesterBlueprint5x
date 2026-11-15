// Read-only Jira Cloud client (REST API v3). Only GET requests are made.
import { HttpError } from './errors.js';

export { HttpError };

const KEY_RE = /^[A-Z][A-Z0-9_]+-\d+$/;

export function normalizeIssueKey(raw) {
  const key = String(raw || '').trim().toUpperCase();
  if (!key) throw new HttpError(400, 'Enter a Jira issue ID, for example QA-123.');
  if (!KEY_RE.test(key)) throw new HttpError(400, `"${raw}" is not a valid Jira issue ID (expected format PROJECT-123).`);
  return key;
}

function requireConfig(s) {
  const missing = [];
  if (!s.jiraBaseUrl) missing.push('JIRA_BASE_URL');
  if (!s.jiraEmail) missing.push('JIRA_EMAIL');
  if (!s.jiraToken) missing.push('JIRA_TOKEN');
  if (missing.length) throw new HttpError(400, `Jira is not configured. Missing: ${missing.join(', ')}. Add them in Settings.`);
}

async function jiraGet(s, apiPath) {
  requireConfig(s);
  const auth = Buffer.from(`${s.jiraEmail}:${s.jiraToken}`).toString('base64');
  let res;
  try {
    res = await fetch(`${s.jiraBaseUrl}${apiPath}`, {
      headers: { Authorization: `Basic ${auth}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new HttpError(502, 'Could not reach Jira. Check the base URL and your network connection.');
  }
  if (res.ok) return res.json();
  if (res.status === 401) throw new HttpError(401, 'Jira authentication failed. Check the email and API token.');
  if (res.status === 403) throw new HttpError(403, 'Jira denied access. The account lacks permission for this request.');
  if (res.status === 404) throw new HttpError(404, 'Not found in Jira, or the account cannot view it.');
  throw new HttpError(502, `Jira returned an unexpected error (HTTP ${res.status}).`);
}

export async function testJira(s) {
  const me = await jiraGet(s, '/rest/api/3/myself');
  if (s.usingServerJira) return 'Connected to Jira using the server default credentials.';
  return `Connected to Jira as ${me.displayName || 'the configured account'}.`;
}

// Atlassian Document Format -> plain text (keeps lists, headings, tables readable).
export function adfToText(node) {
  if (!node) return '';
  if (typeof node === 'string') return node;
  const kids = (node.content || []).map(adfToText);
  switch (node.type) {
    case 'text': return node.text || '';
    case 'hardBreak': return '\n';
    case 'mention': return node.attrs?.text || '';
    case 'inlineCard': return node.attrs?.url || '';
    case 'paragraph': return kids.join('') + '\n';
    case 'heading': return '#'.repeat(node.attrs?.level || 2) + ' ' + kids.join('') + '\n';
    case 'listItem': return '- ' + kids.join('').trim().replace(/\n/g, '\n  ') + '\n';
    case 'bulletList':
    case 'orderedList': return kids.join('') + '\n';
    case 'codeBlock': return '```\n' + kids.join('') + '\n```\n';
    case 'tableRow': return '| ' + kids.map((k) => k.trim().replace(/\n+/g, ' ')).join(' | ') + ' |\n';
    default: return kids.join('');
  }
}

const asText = (v) => {
  if (v == null || v === '') return '';
  if (typeof v === 'string') return v;
  if (v.type === 'doc') return adfToText(v).trim();
  if (Array.isArray(v)) return v.map(asText).filter(Boolean).join(', ');
  return v.value || v.name || v.displayName || '';
};

export async function fetchIssue(s, rawKey) {
  const key = normalizeIssueKey(rawKey);
  let data;
  try {
    data = await jiraGet(s, `/rest/api/3/issue/${encodeURIComponent(key)}?expand=names`);
  } catch (e) {
    if (e.status === 404) throw new HttpError(404, `Issue ${key} was not found, or the account cannot view it.`);
    throw e;
  }
  const f = data.fields || {};
  const names = data.names || {};
  const byName = (re) => Object.keys(f).filter((id) => re.test(names[id] || '') && f[id] != null);

  const acceptanceCriteria = byName(/acceptance criteria/i).map((id) => asText(f[id])).filter(Boolean).join('\n');
  const sprints = byName(/^sprint$/i).flatMap((id) => (Array.isArray(f[id]) ? f[id] : []))
    .map((sp) => [sp.name, sp.state, sp.startDate?.slice(0, 10), sp.endDate?.slice(0, 10)].filter(Boolean).join(' | '));
  const storyPoints = byName(/story point/i).map((id) => f[id]).find((v) => typeof v === 'number');

  return {
    key: data.key,
    url: `${s.jiraBaseUrl}/browse/${data.key}`,
    summary: f.summary || '',
    issueType: f.issuetype?.name || '',
    status: f.status?.name || '',
    priority: f.priority?.name || '',
    labels: f.labels || [],
    components: (f.components || []).map((c) => c.name),
    fixVersions: (f.fixVersions || []).map((v) => v.name),
    parent: f.parent ? `${f.parent.key}: ${f.parent.fields?.summary || ''}` : '',
    description: asText(f.description),
    environment: asText(f.environment),
    acceptanceCriteria,
    sprints,
    storyPoints: storyPoints ?? null,
    dueDate: f.duedate || '',
    subtasks: (f.subtasks || []).map((t) => `${t.key}: ${t.fields?.summary || ''}`),
    links: (f.issuelinks || []).map((l) => {
      const other = l.outwardIssue || l.inwardIssue;
      const rel = l.outwardIssue ? l.type?.outward : l.type?.inward;
      return other ? `${rel} ${other.key}: ${other.fields?.summary || ''}` : '';
    }).filter(Boolean),
  };
}
