import { spawn } from 'child_process';
import path from 'path';

// --- Helper function for weighted random sampling ---
function weighted_sample(distribution) {
    const total = Object.values(distribution).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * total;
    for (const key in distribution) {
        random -= distribution[key];
        if (random <= 0) {
            return key;
        }
    }
    return Object.keys(distribution)[0]; // Fallback
}

// --- Category preferences based on address ---
const categoryPreferences = {
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266": { "ELECTION": 0.7, "SPORTS": 0.2, "CRYPTO": 0.1, "TV": 0 },
    // Add other addresses and their preferences here
    "default": { "ELECTION": 0.25, "SPORTS": 0.25, "CRYPTO": 0.25, "TV": 0.25 }
};


export default function handler(req, res) {
    const { address } = req.query;

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: 'A valid Ethereum address is required.' });
    }

    // Select category distribution or use default
    const distribution = categoryPreferences[address] || categoryPreferences["default"];
    const category = weighted_sample(distribution);

    const agentDir = path.resolve('./prediction-market-nodejs/prediction-agent-py/prediction_agent');
    const pythonExecutable = path.resolve(process.env.HOME, 'Documents/training/.venv/bin/python3');
    
    // The command to run the agent via the python module, which is more robust than relying on the adk CLI path
    const adkProcess = spawn(pythonExecutable, ['-m', 'adk.run', '.', '--prompt', category], {
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
            return res.status(500).json({ error: 'Failed to execute prediction agent.', details: errorToSend });
        }
        
        try {
            // The agent output might contain markdown, so we need to extract the JSON
            const jsonMatch = dataToSend.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/);
            if (!jsonMatch) {
                throw new Error("No JSON object found in the agent's output.");
            }
            
            // Take the first non-null capturing group
            const jsonString = jsonMatch[1] || jsonMatch[2];
            const prediction = JSON.parse(jsonString);
            res.status(200).json(prediction);

        } catch (e) {
            console.error(`Error parsing JSON: ${e.message}`);
            console.error(`Raw data from agent: ${dataToSend}`);
            res.status(500).json({ error: 'Failed to parse prediction JSON from agent.', details: dataToSend });
        }
    });

    adkProcess.on('error', (err) => {
        console.error('Failed to start ADK process.', err);
        res.status(500).json({ error: 'Failed to start the prediction agent process.', details: err.message });
    });
}