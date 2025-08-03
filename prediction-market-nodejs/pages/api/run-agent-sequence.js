import { spawn } from 'child_process';
import path from 'path';

// Prompts for each agent in the sequence
const prompts = {
    trendDiscovery: "You are a trend analysis specialist. Your job is to identify the top 3-5 trending topics in {CATEGORY} that would make compelling betting propositions. Focus on topics with:\n- Recent surge in interest\n- Upcoming events or deadlines  \n- Measurable outcomes\n- Broad public interest\nReturn an array of trending topics with estimated search volumes.",
    socialSentiment: "You are a social media analyst. Analyze the sentiment and discussion volume around these trending topics: {TOPICS}\n\nFor each topic, determine:\n- Overall sentiment (positive/negative/neutral)\n- Discussion volume (high/medium/low)\n- Key talking points and controversies\n- Likelihood of continued engagement\n\nReturn sentiment analysis data for each topic.",
    betGeneration: "You are an expert betting market maker. Using the trending topics and social sentiment data, create exactly 3 unique yes/no betting propositions.\n\nFor each bet, ensure:\n- Clear yes/no question format\n- Specific timeframe for resolution\n- Objective, measurable outcome\n- Appeals to current public interest\n\nReturn structured bet objects with question, timeframe, and category.",
    validation: "You are a betting compliance specialist. Validate these betting propositions for:\n- Clear, unambiguous resolution criteria\n- Reliable data sources for outcome verification\n- Appropriate timeframes (not too short/long)\n- No insider information advantages\n- Regulatory compliance\n\nFor each bet, provide or suggest a specific data source URL that will determine the outcome.",
    enhancement: "You are a content enhancement specialist. For each validated bet, add:\n- 2-3 sentences explaining why this bet is particularly interesting right now\n- 1-3 keywords suitable for Unsplash image search\n- Estimated engagement potential (High/Medium/Low)\n- Any additional context that makes the bet more compelling\n\nReturn the final enhanced betting propositions ready for display."
};

const agentSequence = ['trendDiscovery', 'socialSentiment', 'betGeneration', 'validation', 'enhancement'];

// Function to execute a single agent
function executeAgent(prompt) {
    return new Promise((resolve, reject) => {
        const agentDir = path.resolve('./prediction-market-nodejs/prediction-agent-py/prediction_agent');
        const pythonExecutable = path.resolve(process.env.HOME, 'Documents/training/.venv/bin/python3');

        const adkProcess = spawn(pythonExecutable, ['-m', 'adk.run', '.', '--prompt', prompt], {
            cwd: agentDir,
            env: { ...process.env, "PYTHONPATH": path.resolve('./prediction-market-nodejs/prediction-agent-py') }
        });

        let dataToSend = '';
        let errorToSend = '';

        adkProcess.stdout.on('data', (data) => {
            dataToSend += data.toString();
        });

        adkProcess.stderr.on('data', (data) => {
            errorToSend += data.toString();
        });

        adkProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`ADK process exited with code ${code}`);
                console.error(`stderr: ${errorToSend}`);
                return reject({ error: 'Failed to execute prediction agent.', details: errorToSend });
            }

            try {
                const jsonMatch = dataToSend.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/);
                if (!jsonMatch) {
                    throw new Error("No JSON object found in the agent's output.");
                }
                const jsonString = jsonMatch[1] || jsonMatch[2];
                const result = JSON.parse(jsonString);
                resolve(result);
            } catch (e) {
                console.error(`Error parsing JSON: ${e.message}`);
                console.error(`Raw data from agent: ${dataToSend}`);
                reject({ error: 'Failed to parse prediction JSON from agent.', details: dataToSend });
            }
        });

        adkProcess.on('error', (err) => {
            console.error('Failed to start ADK process.', err);
            reject({ error: 'Failed to start the prediction agent process.', details: err.message });
        });
    });
}


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { category } = req.body;

    if (!category) {
        return res.status(400).json({ error: 'Category is required.' });
    }

    let agentData = {};
    let currentInput = category;

    try {
        for (const agentId of agentSequence) {
            let prompt = prompts[agentId];

            if (agentId === 'trendDiscovery') {
                prompt = prompt.replace('{CATEGORY}', category);
            } else {
                prompt = prompt.replace('{TOPICS}', JSON.stringify(agentData[agentSequence[agentSequence.indexOf(agentId) - 1]]));
            }

            const result = await executeAgent(prompt);
            agentData[agentId] = result;
        }
        res.status(200).json(agentData);
    } catch (error) {
        res.status(500).json(error);
    }
}
