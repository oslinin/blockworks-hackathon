import React, { useState, useEffect, useRef, useCallback } from 'react';

const MultiAgentBettingGenerator = () => {
    // State for the component
    const [category, setCategory] = useState('Sports');
    const [prompts, setPrompts] = useState({});
    const [agentState, setAgentState] = useState({});
    const [workflowVisible, setWorkflowVisible] = useState(false);
    const [debugVisible, setDebugVisible] = useState(false);
    const [debugMessages, setDebugMessages] = useState([]);
    const [error, setError] = useState(null);
    const [betCards, setBetCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeAgent, setActiveAgent] = useState(null);
    const [isKeyValid, setIsKeyValid] = useState(null);
    const [keyValidationError, setKeyValidationError] = useState('');

    useEffect(() => {
        const validateApiKey = async () => {
            try {
                const response = await fetch('/api/validate-key', { method: 'POST' });
                const data = await response.json();
                setIsKeyValid(data.valid);
                if (!data.valid) {
                    setKeyValidationError(data.error || 'API Key validation failed.');
                }
            } catch (e) {
                setIsKeyValid(false);
                setKeyValidationError('Failed to connect to the validation service.');
            }
        };
        validateApiKey();
    }, []);

    const getAgentName = (agentId) => {
        const names = {
            trendDiscovery: 'Trend Discovery Agent',
            socialSentiment: 'Social Sentiment Agent',
            betGeneration: 'Bet Generation Agent',
            validation: 'Validation Agent',
            enhancement: 'Enhancement Agent'
        };
        return names[agentId] || agentId;
    };

    const agentSequence = ['trendDiscovery', 'socialSentiment', 'betGeneration', 'validation', 'enhancement'];

    const defaultPrompts = {
        trendDiscovery: `You are a trend analysis specialist. Identify the top 3-5 trending topics in the '{CATEGORY}' category suitable for betting.

IMPORTANT: Your response MUST be a valid JSON array of objects, and nothing else. Do not include any explanatory text, markdown, or any characters outside of the JSON array. Each object must have the following structure: { "topic": "<topic_name>", "searchVolume": "<estimated_search_volume>" }.`,
        socialSentiment: `You are a social media analyst. Your task is to analyze the sentiment and discussion volume for the following topics: {TOPICS}. For each topic, provide the overall sentiment (positive, negative, or neutral) and the discussion volume (high, medium, or low).

IMPORTANT: Your response MUST be a valid JSON array of objects, and nothing else. Do not include any explanatory text, markdown, or any characters outside of the JSON array. Each object in the array should represent a topic and have the following structure: { "topic": "<topic_name>", "sentiment": "<sentiment>", "discussionVolume": "<volume>" }.`,
        betGeneration: `You are an expert betting market maker. Based on the provided trend and sentiment data, create exactly 3 unique yes/no betting propositions.

IMPORTANT: Your response MUST be a valid JSON array of objects, and nothing else. Do not include any explanatory text, markdown, or any characters outside of the JSON array. Each object must have the following structure: { "category": "<category_name>", "bet": "<yes/no_question>", "why": "<brief_explanation>", "source_url": "<resolution_source_url>" }.`,
        validation: `You are a betting compliance specialist. Validate the following betting propositions. For each bet, confirm it has clear resolution criteria and suggest a reliable data source URL for verification.

IMPORTANT: Your response MUST be a valid JSON array of objects, and nothing else. Do not include any explanatory text, markdown, or any characters outside of the JSON array. Each object must be an enhanced version of the input bet with the following structure: { "category": "<category>", "bet": "<bet_question>", "why": "<why_text>", "source_url": "<original_or_improved_url>", "validated": true, "resolutionCriteria": "<brief_criteria_summary>" }.`,
        enhancement: `You are a content enhancement specialist. For each validated bet, add engaging context, image keywords, and an engagement potential score.

IMPORTANT: Your response MUST be a valid JSON array of objects, and nothing else. Do not include any explanatory text, markdown, or any characters outside of the JSON array. Each object must be the final, enhanced bet with the following structure: { "category": "<category>", "bet": "<bet_question>", "why": "<original_why>", "source_url": "<source_url>", "validated": true, "resolutionCriteria": "<criteria>", "enhancedWhy": "<new_engaging_text>", "imageKeywords": "<keyword1> <keyword2>", "engagementPotential": "<High/Medium/Low>" }.`
    };

    // Refs for DOM elements that don't need to trigger re-renders
    const debugMessagesRef = useRef(null);

    // Initialize prompts
    useEffect(() => {
        const initialPrompts = {};
        agentSequence.forEach(agentId => {
            initialPrompts[agentId] = defaultPrompts[agentId].replace(/{CATEGORY}/g, category);
        });
        setPrompts(initialPrompts);
    }, [category]);

    const debugLog = (message, type = 'agent-data') => {
        setDebugMessages(prev => [...prev, { text: `[${new Date().toLocaleTimeString()}] ${message}`, type }]);
    };

    useEffect(() => {
        if (debugMessagesRef.current) {
            debugMessagesRef.current.scrollTop = debugMessagesRef.current.scrollHeight;
        }
    }, [debugMessages]);

    const handleGenerateClick = async () => {
        setLoading(true);
        setWorkflowVisible(true);
        setDebugVisible(true);
        setError(null);
        setBetCards([]);
        setDebugMessages([]);
        setAgentState({});
        setActiveAgent(null);

        debugLog('🚀 Starting multi-agent workflow...', 'agent-start');

        let agentData = { category };

        const normalizeToArray = (data, agentName) => {
            // Case 1: Data is already an array
            if (Array.isArray(data)) {
                return data;
            }

            // Case 2: Data is an object, and one of its properties is an array
            if (typeof data === 'object' && data !== null) {
                const arrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
                if (arrayKey) {
                    return data[arrayKey];
                }
            }

            // Case 3: Data is an object with a 'text' property that contains a JSON string
            if (data && typeof data.text === 'string') {
                try {
                    const regex = /```json\n([\s\S]*?)\n```/;
                    const match = data.text.match(regex);
                    const jsonText = match ? match[1] : data.text;
                    const parsedData = JSON.parse(jsonText);
                    
                    // After parsing, run it through this function again to find the array
                    return normalizeToArray(parsedData, agentName);
                } catch (e) {
                    // Fall through to the final error if parsing fails
                }
            }

            // If all else fails, throw the error
            throw new Error(`Agent ${agentName} returned data in an unexpected format. Expected an array or an object containing an array. Received: ${JSON.stringify(data)}`);
        };

        try {
            for (const agentId of agentSequence) {
                setActiveAgent(agentId);
                setAgentState(prev => ({ ...prev, [agentId]: 'processing' }));
                debugLog(`🔄 Executing ${getAgentName(agentId)}...`, 'agent-start');

                const result = await executeAgent(agentId, agentData);
                
                // Normalize the output of agents that are supposed to return arrays
                const normalizedResult = normalizeToArray(result, getAgentName(agentId));
                agentData[agentId] = normalizedResult;

                setAgentState(prev => ({ ...prev, [agentId]: 'complete' }));
                debugLog(`✅ ${getAgentName(agentId)} completed`, 'agent-complete');
            }

            if (agentData.enhancement) {
                setBetCards(agentData.enhancement);
                debugLog('🎯 Betting propositions rendered successfully', 'agent-complete');
            }

        } catch (e) {
            console.error('Workflow error:', e);
            let detailedError = 'Agent workflow failed. Please check the console for details.';
            try {
                const errorBodyString = e.message.substring(e.message.indexOf('{'));
                const errorBody = JSON.parse(errorBodyString);
                if (errorBody.details) {
                    detailedError = `Agent workflow failed: ${errorBody.details}`;
                } else if (errorBody.error) {
                    detailedError = `Agent workflow failed: ${errorBody.error}`;
                }
            } catch (parseError) {
                detailedError = e.message;
            }
            debugLog(`❌ Workflow error: ${detailedError}`, 'agent-error');
            setError(detailedError);
        } finally {
            setLoading(false);
            setActiveAgent(null);
        }
    };

    const executeAgent = async (agentId, agentData) => {
        let currentPrompt = prompts[agentId];

        if (agentId === 'socialSentiment' && agentData.trendDiscovery) {
            const topics = agentData.trendDiscovery.map(t => t.topic).join(', ');
            currentPrompt = currentPrompt.replace('{TOPICS}', topics);
        } else if (agentId === 'betGeneration' && agentData.socialSentiment) {
            currentPrompt += `\n\nTRENDS AND SENTIMENT DATA:\n${JSON.stringify(agentData.socialSentiment, null, 2)}`;
        } else if (agentId === 'validation' && agentData.betGeneration) {
            currentPrompt += `\n\nBETS TO VALIDATE:\n${JSON.stringify(agentData.betGeneration, null, 2)}`;
        } else if (agentId === 'enhancement' && agentData.validation) {
            currentPrompt += `\n\nBETS TO ENHANCE:\n${JSON.stringify(agentData.validation, null, 2)}`;
        }

        console.log(`--- [Agent: ${agentId}] ---`);
        console.log(`[Agent] Sending prompt:`, currentPrompt);

        const response = await fetch('/api/agent-proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: currentPrompt }),
        });

        console.log(`[Agent] Raw response status:`, response.status);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`[Agent] Error response body:`, errorBody);
            throw new Error(`Agent ${agentId} failed: ${errorBody}`);
        }

        const responseData = await response.json();
        console.log(`[Agent] Parsed response data:`, responseData);
        return responseData;
    };

    const handlePromptChange = (agentId, value) => {
        setPrompts(prev => ({ ...prev, [agentId]: value }));
    };

    const getStatusClass = (status) => {
        if (status === 'processing') return 'processing';
        if (status === 'complete') return 'complete';
        return 'waiting';
    };

    return (
        <>
            <style jsx>{`
                /* Paste all of style.css content here, adapted for JSX */
                /* NOTE: This is a placeholder. The actual CSS is too long to include directly. */
                .container { max-width: 1400px; margin: 0 auto; padding: 0 16px; }
                .header { text-align: center; margin-bottom: 32px; }
                .card { background-color: #fff; border-radius: 12px; border: 1px solid #eee; box-shadow: 0 1px 3px rgba(0,0,0,0.04); margin-bottom: 24px; padding: 24px; }
                .btn { display: inline-flex; align-items: center; justify-content: center; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.25s; border: none; }
                .btn--primary { background: #21808d; color: #fff; }
                .btn--primary:hover { background: #1a6670; }
                .btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .form-control { display: block; width: 100%; padding: 8px 12px; font-size: 14px; color: #333; background-color: #fff; border: 1px solid #ccc; border-radius: 8px; }
                .agent-section { border: 2px solid #eee; border-radius: 12px; margin-bottom: 16px; }
                .agent-section.active { border-color: #21808d; }
                .agent-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #eee; }
                .status-badge { padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
                .status-badge.waiting { background: #eee; color: #666; }
                .status-badge.processing { background: #f59e0b; color: #fff; animation: pulse 2s infinite; }
                .status-badge.complete { background: #10b981; color: #fff; }
                .workflow-steps { display: flex; justify-content: space-between; align-items: center; position: relative; }
                .workflow-step { display: flex; flex-direction: column; align-items: center; gap: 8px; }
                .step-indicator { width: 24px; height: 24px; border-radius: 50%; background: #eee; }
                .workflow-step.active .step-indicator { background: #f59e0b; }
                .workflow-step.complete .step-indicator { background: #10b981; }
                .debug-panel { max-height: 300px; overflow-y: auto; background: #f9f9f9; border: 1px solid #eee; padding: 16px; }
                .bet-cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px; }
                .bet-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
                .bet-card-image { width: 100%; height: 200px; background: #eee; }
                .bet-card-content { padding: 20px; }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
                .hidden { display: none; }
            `}</style>
            <div className="container">
                <header className="header">
                    <h1>Multi-Agent MCP Betting Generator</h1>
                    <p className="subtitle">Orchestrated AI agents to generate intelligent betting propositions</p>
                </header>

                {isKeyValid === false && (
                    <div className="error-message" style={{ marginBottom: '24px', border: '1px solid red', padding: '16px', borderRadius: '8px', backgroundColor: '#fff5f5', color: '#c53030' }}>
                        <strong>Configuration Error:</strong> {keyValidationError}
                    </div>
                )}

                <section className="config-panel card">
                    <div className="config-header">
                        <h2>Agent Configuration</h2>
                        <div className="form-group category-group">
                            <label htmlFor="category-select" className="form-label">Category</label>
                            <select id="category-select" className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                                <option value="Sports">Sports</option>
                                <option value="Crypto">Crypto</option>
                                <option value="Politics">Politics</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Misc">Misc</option>
                            </select>
                        </div>
                    </div>

                    <div className="agents-container">
                        {agentSequence.map(agentId => (
                            <div key={agentId} className={`agent-section ${activeAgent === agentId ? 'active' : ''}`} data-agent={agentId}>
                                <div className="agent-header">
                                    <div className="agent-info">
                                        <h3>{getAgentName(agentId)}</h3>
                                    </div>
                                    <div className={`status-badge ${getStatusClass(agentState[agentId])}`}>{agentState[agentId] || 'waiting'}</div>
                                </div>
                                <div className="agent-content">
                                    <textarea
                                        className="form-control agent-prompt"
                                        rows="4"
                                        value={prompts[agentId] || ''}
                                        onChange={e => handlePromptChange(agentId, e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="generate-section">
                        <button onClick={handleGenerateClick} className="btn btn--primary btn--lg btn--full-width" disabled={loading || !isKeyValid}>
                            {loading ? 'Generating...' : (isKeyValid === null ? 'Validating Key...' : 'Generate Bets')}
                        </button>
                    </div>
                </section>

                {workflowVisible && (
                    <section className="workflow-panel card">
                        <h3>Agent Workflow Progress</h3>
                        <div className="workflow-steps">
                            {agentSequence.map(agentId => (
                                <div key={agentId} className={`workflow-step ${activeAgent === agentId ? 'active' : ''} ${agentState[agentId] === 'complete' ? 'complete' : ''}`}>
                                    <div className="step-indicator"></div>
                                    <span>{getAgentName(agentId)}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {debugVisible && (
                    <section className="debug-panel card">
                        <div className="debug-header">
                            <h3>Debug Console</h3>
                            <button className="btn btn--outline btn--sm" onClick={() => setDebugVisible(false)}>Hide</button>
                        </div>
                        <div className="debug-content" ref={debugMessagesRef}>
                            {debugMessages.map((msg, i) => (
                                <div key={i} className={`debug-message ${msg.type}`}>{msg.text}</div>
                            ))}
                        </div>
                    </section>
                )}

                {error && <div className="error-message">{error}</div>}

                <section className="bet-cards-grid">
                    {betCards.map((bet, i) => (
                        <div key={i} className="bet-card">
                            <div className="bet-card-image">
                                {/* Image would be loaded here */}
                            </div>
                            <div className="bet-card-content">
                                <span className="category-badge">{bet.category}</span>
                                <h3 className="bet-question">{bet.bet}</h3>
                                <p className="bet-why">{bet.enhancedWhy || bet.why}</p>
                                <a href={bet.dataSource || bet.source_url} target="_blank" rel="noopener noreferrer" className="resolution-source">
                                    Resolution Source
                                </a>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </>
    );
};

export default MultiAgentBettingGenerator;