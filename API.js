const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3000';

async function postChat(messages) {
  const r = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });
  if (!r.ok) throw new Error('API error');
  return r.json();
}

export default { postChat };
