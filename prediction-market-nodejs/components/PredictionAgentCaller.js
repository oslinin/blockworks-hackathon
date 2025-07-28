import { useState } from "react";
import { generateBet } from "../prediction-agent/index.js";

export default function PredictionAgentCaller() {
  const [generatedBet, setGeneratedBet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateBet = async () => {
    setLoading(true);
    setError(null);
    try {
      const bet = await generateBet();
      setGeneratedBet(bet);
    } catch (err) {
      setError("Failed to generate bet: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleGenerateBet} disabled={loading}>
        {loading ? "Generating..." : "Generate New Bet"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {generatedBet && (
        <div>
          <h2>Generated Bet:</h2>
          <pre>{JSON.stringify(generatedBet, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
