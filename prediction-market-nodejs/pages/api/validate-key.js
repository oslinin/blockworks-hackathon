import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      valid: false,
      error: 'GEMINI_API_KEY is not configured on the server. Please add it to your .env.local file and restart the server.'
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Make a lightweight call to list models to validate the key
    await genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    res.status(200).json({ valid: true });
  } catch (error) {
    console.error('Gemini API Key validation failed:', error.message);
    res.status(200).json({
      valid: false,
      error: 'The provided GEMINI_API_KEY is invalid or has expired. Please check your .env.local file.'
    });
  }
}
