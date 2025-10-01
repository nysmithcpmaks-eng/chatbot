import React, { useState } from 'react';
import api from './api';

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a helpful assistant.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const resp = await api.postChat(next);
      const assistant = { role: 'assistant', content: resp.reply };
      setMessages(prev => [...prev, assistant]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: could not get a reply.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ border: '1px solid #ddd', padding: 12, minHeight: 300 }}>
        {messages.filter(m => m.role !== 'system').map((m, i) => (
          <div key={i} style={{ margin: '8px 0' }}>
            <b>{m.role === 'user' ? 'You' : 'Bot'}</b>: {m.content}
          </div>
        ))}
        {loading && <div><i>Bot is typing...</i></div>}
      </div>

      <div style={{ marginTop: 12 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          style={{ width: '80%', padding: 8 }}
          placeholder="Type a message..."
        />
        <button onClick={send} style={{ padding: '8px 12px', marginLeft: 8 }}>Send</button>
      </div>
    </div>
  );
}
