export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch(e) {}
  }

  const { songInfo, instrument, notes, type } = body || {};

  if (!songInfo || !instrument) {
    return res.status(400).json({ error: 'Dati mancanti' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-20240307',
        max_tokens: 1800,
        messages: [{
          role: 'user',
          content: `Sei Patchistant, un esperto di sound design. Rispondi in italiano.\n\nCanzone: ${songInfo}\nStrumento: ${instrument} (${type || ''})\n${notes ? 'Note: ' + notes : ''}\n\nCrea una guida completa con queste sezioni:\n\n### Analisi del suono\n### Impostazioni passo-passo\n### Parametri chiave\n### Suggerimenti live`
        }]
      })
    });

    const data = await response.json();
    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    if (!text) throw new Error('Risposta vuota. Dettaglio: ' + JSON.stringify(data));
    res.status(200).json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
