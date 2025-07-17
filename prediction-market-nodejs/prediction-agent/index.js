const axios = require('axios');

const getPrediction = async (category) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = "gemini-1.5-flash-latest";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const prompt = `You are a prediction market assistant. Given the category I give you (${category}):

Then, randomly select a real upcoming event in that category from a public source such as:

- Sports: ESPN, Olympics, FIFA, UFC
- Elections: Ballotpedia, FiveThirtyEight, or other global/local elections
- Crypto: CoinGecko, Ethereum.org, Bitcoin halving, SEC ETF decisions
- TV:

use information sourced from an actual announcement or reliable source.

Based on the selected event, generate a prediction market bet as a JSON object with the following fields:

{
"question": "Will [EVENT] happen on or before [DATE]?",
"type": "binary",
"tags": ["${category}"],
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

    const data = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }]
    };

    const response = await axios.post(url, data);
    let text = response.data.candidates[0].content.parts[0].text;
    
    const match = text.match(/```json\n([\s\S]*)\n```/);
    if (match) {
        text = match[1];
    }
    
    return JSON.parse(text);
};

const getNWayPrediction = async (category) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = "gemini-1.5-flash-latest";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const prompt = `You are a prediction market assistant. Given the category I give you (${category}):

Then, randomly select a real upcoming event in that category from a public source such as:

- Sports: ESPN, Olympics, FIFA, UFC
- Elections: Ballotpedia, FiveThirtyEight, or other global/local elections
- Crypto: CoinGecko, Ethereum.org, Bitcoin halving, SEC ETF decisions
- TV:

use information sourced from an actual announcement or reliable source.

Based on the selected event, generate a prediction market bet as a JSON object with the following fields:

{
"question": "Who will win the [EVENT]?",
"type": "n-way",
"outcomes": ["[OUTCOME 1]", "[OUTCOME 2]", "[OUTCOME 3]"],
"tags": ["${category}"],
"resolution_source": "[source or URL]",
"deadline": "[YYYY-MM-DD]",
"creator": "auto-gen"
}

Requirements:

- Make sure the event is real and date-bounded. Make sure it is in the future and it is real. If the event is tied to a specific known date (e.g. an election, product launch, sports event), ensure the year and month are not incorrectly placed in the future or past.
- The question must be a "who will win" type of question.
- The "outcomes" array should contain at least 3 possible outcomes.
- The resolution_source must be real or realistically plausible.
- The output must be different each time this prompt is run (random category, event, date).
- Output only the JSON. No explanation or commentary.
`;

    const data = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }]
    };

    const response = await axios.post(url, data);
    let text = response.data.candidates[0].content.parts[0].text;

    const match = text.match(/```json\n([\s\S]*)\n```/);
    if (match) {
        text = match[1];
    }

    return JSON.parse(text);
}

module.exports = { getPrediction, getNWayPrediction };
