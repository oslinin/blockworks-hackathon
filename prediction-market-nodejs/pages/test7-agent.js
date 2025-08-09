import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

const BareBonesAgent = () => {
    const [prompt1, setPrompt1] = useState(`You are a multi-talented analysis agent.
First, act as a trend analysis specialist. Identify the top 3-5 trending topics in the 'Sports' category suitable for betting.
Second, act as a social media analyst. For those topics, analyze the sentiment and discussion volume.
Third, for each topic, find a relevant, publicly accessible image URL.
Your final response MUST be a single valid JSON array of objects, and nothing else. Do not include any explanatory text, markdown, or any characters outside of the JSON array. Each object must have the following structure: { "topic": "<topic_name>", "searchVolume": "<estimated_search_volume>", "sentiment": "<sentiment>", "discussionVolume": "<volume>", "imageUrl": "<image_url>" }.`);
    const [prompt2, setPrompt2] = useState(`You are a data validation and enhancement agent. You will receive a JSON array of objects as input.
Your task is to process this data and ensure its accuracy. For each object in the array, you must:
1. Verify that the 'imageUrl' is a real, publicly accessible URL that points directly to an image file (like .jpg or .png).
2. If the URL is broken, invalid, or does not point to an image, you MUST find a valid, working image URL from the web that is relevant to the 'topic'.
Your final response MUST be the original JSON array, but with all 'imageUrl' values corrected and verified. Do not change any other fields.`);
    const [output, setOutput] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const executePrompt = async (prompt) => {
        const response = await fetch('/api/agent-proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API request failed: ${errorBody}`);
        }

        return response.json();
    };

    const handleRunClick = async () => {
        setLoading(true);
        setError(null);
        setOutput(null);

        try {
            // Execute the first prompt
            const result1 = await executePrompt(prompt1);
            
            // Prepare the second prompt
            const finalPrompt2 = `${prompt2}\n\nINPUT DATA:\n${JSON.stringify(result1, null, 2)}`;

            // Execute the second prompt
            const result2 = await executePrompt(finalPrompt2);

            setOutput(result2);

        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style jsx>{`
                .container { max-width: 800px; margin: 0 auto; padding: 2rem; font-family: sans-serif; }
                .header { text-align: center; margin-bottom: 2rem; }
                .card { background-color: #fff; border-radius: 8px; border: 1px solid #eee; box-shadow: 0 1px 3px rgba(0,0,0,0.04); padding: 1.5rem; }
                .form-group { margin-bottom: 1rem; }
                .form-label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
                .form-control { display: block; width: 100%; padding: 0.5rem 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 4px; }
                .btn { display: inline-block; padding: 0.5rem 1rem; border-radius: 4px; font-size: 1rem; cursor: pointer; border: 1px solid transparent; }
                .btn-primary { background-color: #21808d; color: #fff; }
                .btn-primary:hover { background-color: #1a6670; }
                .btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .output-panel { margin-top: 2rem; }
                .output-header { font-weight: bold; margin-bottom: 0.5rem; }
                .raw-output { background-color: #f9f9f9; border: 1px solid #eee; border-radius: 4px; padding: 1rem; white-space: pre-wrap; word-wrap: break-word; }
                .error-message { color: #c53030; background-color: #fff5f5; border: 1px solid #c53030; border-radius: 4px; padding: 1rem; margin-top: 1rem; }
            `}</style>
            <div className="container">
                <header className="header">
                    <h1>Bare Bones Agent Runner</h1>
                    <p>A simplified interface to run a sequence of agent prompts.</p>
                </header>

                <div className="card">
                    <div className="form-group">
                        <label htmlFor="prompt1-input" className="form-label">Prompt 1</label>
                        <textarea
                            id="prompt1-input"
                            className="form-control"
                            rows="8"
                            value={prompt1}
                            onChange={e => setPrompt1(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="prompt2-input" className="form-label">Prompt 2</label>
                        <textarea
                            id="prompt2-input"
                            className="form-control"
                            rows="5"
                            value={prompt2}
                            onChange={e => setPrompt2(e.target.value)}
                            placeholder="This prompt will receive the output of Prompt 1 as input."
                        />
                    </div>

                    <button onClick={handleRunClick} className="btn btn-primary" disabled={loading}>
                        {loading ? 'Running Sequence...' : 'Run Sequence'}
                    </button>
                </div>

                {output && (
                    <div className="output-panel">
                        <h3 className="output-header">JSON Output</h3>
                        <div className="raw-output">
                            <ReactJson 
                                src={output} 
                                theme="monokai" 
                                collapsed={false}
                                enableClipboard={true}
                                displayDataTypes={false}
                            />
                        </div>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
            </div>
        </>
    );
};

export default BareBonesAgent;
