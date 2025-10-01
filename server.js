const express = require('express');
const fetch = require('node-fetch'); // or use axios
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const LLM_API_KEY = process.env.LLM_API_KEY;
const LLM_API_URL = process.env.LLM_API_URL;
const MODEL_NAME = process.env.MODEL_NAME || 'default-model';

if (!LLM_API_KEY) {
  console.error('Missing LLM_API_KEY in environment');
  process.exit(1);
}

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages array' });
    }

    // Example: forward to a generic LLM HTTP API that accepts messages
    const payload = {
      model: MODEL_NAME,
      messages,
      max_tokens: 800
    };

    const r = await fetch(LLM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LLM_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(502).json({ error: 'LLM provider error', detail: text });
    }

    const data = await r.json();
    // Adapt this depending on provider response shape
    const reply = data.choices?.[0]?.message?.content ?? data.output ?? data.text ?? '';

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
