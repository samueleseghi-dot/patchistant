module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { songInfo, instrument, notes, lang } = req.body || {};

  if (!songInfo || !instrument) {
    return res.status(400).json({ error: 'Missing data' });
  }

  const language = lang || 'italiano';

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1800,
        messages: [{
          role: 'user',
          content: `You are Patchistant, a professional sound design expert for keyboards. Reply in ${language}.

Song: ${songInfo}
Keyboard: ${instrument}${notes ? '\nNotes: ' + notes : ''}

Create a complete patch guide with these sections:

### Sound Analysis
Describe the sonic characteristics of the original sound.

### Step-by-step Settings
Detailed guide with precise values for ${instrument}.

### Key Parameters
Compact list of main values.

### Live Tips
Practical tips for live performance.`
        }]
      })
    });

    const data = await response.json();
    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    if (!text) throw new Error(JSON.stringify(data));
    res.status(200).json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
