import { useState } from 'react';

const TEST_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

export default function Test7AgentVertex() {
    const [bet, setBet] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getPrediction = async () => {
        setLoading(true);
        setError(null);
        setBet(null);
        try {
            const response = await fetch('/api/generate-bet-vertex', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: TEST_ADDRESS }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setBet(data);
        } catch (e) {
            setError(e.message);
            console.error("Error fetching prediction from Vertex AI", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <h1>Test 7: Get Prediction from Agent on Vertex AI</h1>
            <p>
                This page fetches a prediction from the Python agent running on Vertex AI.
            </p>
            <p>
                Using address: <strong>{TEST_ADDRESS}</strong>
            </p>
            <button onClick={getPrediction} disabled={loading} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
                {loading ? 'Generating...' : 'Generate Prediction from Vertex AI'}
            </button>
            
            {error && <p style={{ color: 'red', marginTop: '20px' }}><strong>Error:</strong> {error}</p>}
            
            {bet && (
                <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                    <h2>{bet.question}</h2>
                    <p><strong>Deadline:</strong> {bet.deadline} | <strong>Source:</strong> {bet.resolution_source}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '15px' }}>
                        {bet.outcomes.map((outcome, index) => (
                            <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', textAlign: 'center', minWidth: '200px' }}>
                                <img src={outcome.picture_url} alt={outcome.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
                                <h3 style={{ marginTop: '10px' }}>{outcome.name}</h3>
                            </div>
                        ))}
                    </div>
                    <div style={{marginTop: '20px'}}>
                        <h4>Raw JSON:</h4>
                        <pre style={{ backgroundColor: '#eee', padding: '10px', borderRadius: '4px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                            {JSON.stringify(bet, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
