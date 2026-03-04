export default async function handler(req, res) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key mancante' });
    }

    const response = await fetch('https://api.anthropic.com/v1/models', {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      }
    });

    const data = await response.json();
    return res.status(200).json(data);
    
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
