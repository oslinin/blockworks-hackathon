import { useState } from 'react';

export default function Test6Agent() {
    const [bet, setBet] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerateBet = async () => {
        setLoading(true);
        setBet(null);
        // The agent functionality is currently unavailable.
        setLoading(false);
    };

    return (
        <div>
            <h1>Test 6: Generate Bet with Agent</h1>
            <button onClick={handleGenerateBet} disabled={loading}>
                {loading ? "Generating..." : "Generate Bet"}
            </button>
            {bet && (
                <pre>{JSON.stringify(bet, null, 2)}</pre>
            )}
        </div>
    );
}

