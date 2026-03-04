export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { songInfo, instrument, notes, type } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1800,
        messages: [{
          role: 'user',
          content: `Sei Patchistant, un esperto di sound design per strumenti musicali. Rispondi in italiano.

Canzone: ${songInfo}
Strumento: ${instrument} (${type})${notes ? '\nNote: ' + notes : ''}

Crea una guida completa strutturata così:

### Analisi del suono
Caratteristiche sonore del suono originale.

### Impostazioni passo-passo
Guida dettagliata con valori precisi per ${instrument}.

### Parametri chiave
Lista dei valori principali.

### Sug
