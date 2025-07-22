import { spawn } from 'child_process';
import path from 'path';

export default function handler(req, res) {
    const { address } = req.query;

    // Basic validation for the address
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: 'A valid address is required.' });
    }

    const scriptPath = path.resolve('./prediction-market-nodejs/prediction-agent-py/main.py');
    const pythonProcess = spawn('python3', [scriptPath, address]);

    let dataToSend = '';
    let errorToSend = '';

    pythonProcess.stdout.on('data', (data) => {
        dataToSend += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorToSend += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`stderr: ${errorToSend}`);
            return res.status(500).json({ error: 'Failed to execute prediction agent.', details: errorToSend });
        }
        try {
            const prediction = JSON.parse(dataToSend);
            res.status(200).json(prediction);
        } catch (e) {
            console.error(`Error parsing JSON: ${e}`);
            console.error(`Raw data: ${dataToSend}`);
            res.status(500).json({ error: 'Failed to parse prediction JSON.', details: dataToSend });
        }
    });
}
