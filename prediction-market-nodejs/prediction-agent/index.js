const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateBet(category = "", llm = "gemini") {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt = `You are a prediction market assistant. Given the category I give you (sports, election or crypto):

Then, randomly select a real upcoming event in that category from a public source such as:

- Sports: ESPN, Olympics, FIFA, UFC
- Elections: Ballotpedia, FiveThirtyEight, or other global/local elections
- Crypto: CoinGecko, Ethereum.org, Bitcoin halving, SEC ETF decisions

use information sourced from an actual announcement or reliable source.

Based on the selected event, generate a prediction market bet as a JSON object with the following fields:

{
"question": "Will [EVENT] happen on or before [DATE]?",
"type": "binary",
"tags": ["category"],
"resolution_source": "[source or URL]",
"deadline": "[YYYY-MM-DD]",
"creator": "auto-gen"
}

Requirements:

- Make sure the event is real and date-bounded. Make sure it is in the future and it is real. If the event is tied to a specific known date (e.g. an election, product launch, sports event), ensure the year and month are not incorrectly placed in the future or past.
- The question must be clearly answerable with YES or NO.
- The resolution_source must be real or realistically plausible.
- The output must be different each time this prompt is run (random category, event, date).
- Output only the JSON. No explanation or commentary.
  `;

    if (category) {
        prompt += `\nFocus on the '${category}' category.`;
    }

    // The prompt specifies using ChatGPT, Claude, or Gemini. Since we are using Gemini, we'll just use the default model.
    // If the prompt implied switching LLMs, we would need to integrate with those APIs.

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Attempt to parse the JSON from the response
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
            return JSON.parse(jsonMatch[1]);
        } else {
            // If no JSON block, try to parse the whole text as JSON
            return JSON.parse(text);
        }
    } catch (error) {
        console.error("Error generating bet:", error);
        return null;
    }
}

module.exports = { generateBet };
