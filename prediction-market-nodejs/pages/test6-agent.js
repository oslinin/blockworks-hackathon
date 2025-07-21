import { useState } from 'react';

export default function Test6Agent() {
    const [bet, setBet] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getPrediction = async () => {
        setLoading(true);
        setError(null);
        try {
            // This endpoint does not exist yet.
            const response = await fetch('http://localhost:8000/get_random_prediction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setBet(data);
        } catch (e) {
            setError(e.message);
            console.error("Error fetching prediction", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Test 6: Get Prediction from Agent</h1>
            <p>
                This page fetches a prediction from the Python ADK agent.
                Make sure the agent is running. See the updated README.md for instructions.
            </p>
            <button onClick={getPrediction} disabled={loading} style={{ backgroundColor: '#eee', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginRight: '10px' }}>
                {loading ? 'Loading...' : 'Get Random Prediction'}
            </button>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {bet && (
                <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <h2>Prediction Details:</h2>
                    <pre>{JSON.stringify(bet, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}