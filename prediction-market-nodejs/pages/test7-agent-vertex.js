import { useState } from 'react';
import { generateBet } from '../prediction-agent/vertex';

export default function Test7AgentVertex() {
    const [bet, setBet] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerateBet = async () => {
        setLoading(true);
        setBet(null);
        try {
            const data = await generateBet();
            setBet(data);
        } catch (error) {
            console.error("Error generating bet", error);
        }
        setLoading(false);
    };

    return (
        <div>
            <h1>Test 7: Generate Bet with Vertex Agent</h1>
            <button onClick={handleGenerateBet} disabled={loading}>
                {loading ? "Generating..." : "Generate Bet"}
            </button>
            {bet && (
                <pre>{JSON.stringify(bet, null, 2)}</pre>
            )}
        </div>
    );
}
