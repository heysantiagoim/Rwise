import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.get('/', (req, res) => {
  res.send('Stream Polyglot backend activo');
});

app.post('/translate', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.json({ translation: '' });

  try {
    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Translate to Spanish: ' + text }] }]
        })
      }
    );
    const j = await r.json();
    const out =
      j.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ translation: out });
  } catch (e) {
    res.status(500).json({ error: 'Gemini error' });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Backend running on', port);
});
