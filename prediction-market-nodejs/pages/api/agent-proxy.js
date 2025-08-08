import { GoogleGenerativeAI } from '@google/generative-ai';

// Check for the API key at the module level
if (!process.env.GEMINI_API_KEY) {
  console.error('FATAL ERROR: GEMINI_API_KEY environment variable is not set.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  console.log('--- [API] Received request ---');
  if (req.method !== 'POST') {
    console.log(`[API] Method Not Allowed: ${req.method}`);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Add a specific check within the handler for immediate feedback
  if (!process.env.GEMINI_API_KEY) {
    console.error('[API] FATAL: GEMINI_API_KEY is not configured on the server.');
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server. Please add it to your .env.local file and restart the server.' });
  } else {
    console.log('[API] GEMINI_API_KEY found.');
  }

  const { prompt } = req.body;
  console.log('[API] Received prompt:', prompt);

  if (!prompt) {
    console.log('[API] Error: Prompt is required.');
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    console.log('[API] Initializing Gemini model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    console.log('[API] Sending prompt to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    console.log('[API] Received response from Gemini:', text);
    
    let jsonText = text;
    
    // Regex to find JSON within markdown code blocks
    const regex = /```json\n([\s\S]*?)\n```/;
    const match = text.match(regex);

    if (match && match[1]) {
        jsonText = match[1];
        console.log('[API] Extracted JSON from markdown block.');
    } else {
        console.log('[API] No markdown block found, attempting to parse entire text.');
    }

    try {
        const json = JSON.parse(jsonText);
        console.log('[API] Parsed response as JSON.');
        res.status(200).json(json);
    } catch (e) {
        console.error('[API] Failed to parse JSON, returning original text in an object.', e);
        // If parsing fails, return the original text so the client can see it
        res.status(200).json({ text: text });
    }

  } catch (error) {
    console.error('[API] Error calling Gemini API:', error);
    const errorMessage = error.message || 'An unknown error occurred.';
    res.status(500).json({
        error: 'Failed to generate content from the LLM.',
        details: errorMessage,
    });
  }
}
