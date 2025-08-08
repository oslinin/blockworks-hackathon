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

    const agentSequence = ['trendDiscovery', 'socialSentiment', 'betGeneration', 'validation', 'enhancement'];

    const defaultPrompts = {
        trendDiscovery: "You are a trend analysis specialist. Your job is to identify the top 3-5 trending topics in {CATEGORY} that would make compelling betting propositions. Focus on topics with:\n- Recent surge in interest\n- Upcoming events or deadlines  \n- Measurable outcomes\n- Broad public interest\nReturn an array of trending topics with estimated search volumes.",
        socialSentiment: "You are a social media analyst. Analyze the sentiment and discussion volume around these trending topics: {TOPICS}\n\nFor each topic, determine:\n- Overall sentiment (positive/negative/neutral)\n- Discussion volume (high/medium/low)\n- Key talking points and controversies\n- Likelihood of continued engagement\n\nReturn sentiment analysis data for each topic.",
        betGeneration: "You are an expert betting market maker. Using the trending topics and social sentiment data, create exactly 3 unique yes/no betting propositions.\n\nFor each bet, ensure:\n- Clear yes/no question format\n- Specific timeframe for resolution\n- Objective, measurable outcome\n- Appeals to current public interest\n\nReturn structured bet objects with question, timeframe, and category.",
        validation: "You are a betting compliance specialist. Validate these betting propositions for:\n- Clear, unambiguous resolution criteria\n- Reliable data sources for outcome verification\n- Appropriate timeframes (not too short/long)\n- No insider information advantages\n- Regulatory compliance\n\nFor each bet, provide or suggest a specific data source URL that will determine the outcome.",
        enhancement: "You are a content enhancement specialist. For each validated bet, add:\n- 2-3 sentences explaining why this bet is particularly interesting right now\n- 1-3 keywords suitable for Unsplash image search\n- Estimated engagement potential (High/Medium/Low)\n- Any additional context that makes the bet more compelling\n\nReturn the final enhanced betting propositions ready for display."
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

        let currentData = { category };

        try {
            for (const agentId of agentSequence) {
                setActiveAgent(agentId);
                setAgentState(prev => ({ ...prev, [agentId]: 'processing' }));
                debugLog(`🔄 Executing ${getAgentName(agentId)}...`, 'agent-start');

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));

                const result = executeAgent(agentId, currentData);
                currentData = { ...currentData, ...result };

                setAgentState(prev => ({ ...prev, [agentId]: 'complete' }));
                debugLog(`✅ ${getAgentName(agentId)} completed`, 'agent-complete');
            }

            setBetCards(currentData.enhancement);
            debugLog('🎯 Betting propositions rendered successfully', 'agent-complete');

        } catch (e) {
            console.error('Workflow error:', e);
            debugLog(`❌ Workflow error: ${e.message}`, 'agent-error');
            setError('Agent workflow failed. Showing sample data instead.');
            setBetCards(getSampleBets(category));
        } finally {
            setLoading(false);
            setActiveAgent(null);
        }
    };

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

    const executeAgent = (agentId, currentData) => {
        switch (agentId) {
            case 'trendDiscovery':
                return { trendDiscovery: getSimulatedTrends(currentData.category) };
            case 'socialSentiment':
                return { socialSentiment: executeSocialSentimentAgent(currentData.trendDiscovery) };
            case 'betGeneration':
                return { betGeneration: generateSampleBets(currentData.category) };
            case 'validation':
                return { validation: executeValidationAgent(currentData.betGeneration) };
            case 'enhancement':
                return { enhancement: executeEnhancementAgent(currentData.validation) };
            default:
                throw new Error(`Unknown agent: ${agentId}`);
        }
    };

    const getSimulatedTrends = (category) => {
        const trendData = {
            Sports: [
                { topic: 'NFL Playoff Race', searchVolume: '2.3M', trend: '+45%' },
                { topic: 'NBA Trade Deadline', searchVolume: '1.8M', trend: '+62%' },
                { topic: 'Soccer World Cup Qualifiers', searchVolume: '3.1M', trend: '+38%' }
            ],
            Crypto: [
                { topic: 'Bitcoin ETF Approval', searchVolume: '4.2M', trend: '+89%' },
                { topic: 'Ethereum 2.0 Staking', searchVolume: '1.9M', trend: '+54%' },
                { topic: 'DeFi Protocol Updates', searchVolume: '1.2M', trend: '+31%' }
            ],
            Politics: [
                { topic: 'Election Polling Data', searchVolume: '3.5M', trend: '+71%' },
                { topic: 'Climate Policy Voting', searchVolume: '2.1M', trend: '+43%' },
                { topic: 'Congressional Approval', searchVolume: '1.6M', trend: '+28%' }
            ],
            Entertainment: [
                { topic: 'Streaming Wars', searchVolume: '2.8M', trend: '+56%' },
                { topic: 'AI-Generated Content', searchVolume: '3.4M', trend: '+92%' },
                { topic: 'Virtual Concert Revenue', searchVolume: '1.4M', trend: '+34%' }
            ],
            Misc: [
                { topic: 'Lab-Grown Meat', searchVolume: '1.7M', trend: '+48%' },
                { topic: 'Mars Mission Timeline', searchVolume: '2.2M', trend: '+67%' },
                { topic: 'Autonomous Vehicle Adoption', searchVolume: '2.9M', trend: '+73%' }
            ]
        };
        return trendData[category] || trendData.Sports;
    };

    const executeSocialSentimentAgent = (trends) => {
        return trends.map(trend => ({
            ...trend,
            sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)],
            discussionVolume: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
        }));
    };

    const generateSampleBets = (category) => {
        const betData = {
            Sports: [
                {
                    category: "Sports",
                    bet: "Will the Lakers make the NBA playoffs this season?",
                    why: "The Lakers have made several key roster changes and LeBron James is entering his 22nd season. Their playoff chances depend heavily on team chemistry and injury management.",
                    source_url: "https://www.nba.com/playoffs",
                    image_keywords: "basketball court NBA"
                },
                {
                    category: "Sports",
                    bet: "Will Lionel Messi score 20+ goals in MLS this season?",
                    why: "Messi's adaptation to MLS continues to be closely watched. His goal-scoring rate will indicate how well he's adjusting to the league's unique style and travel demands.",
                    source_url: "https://www.mlssoccer.com/stats",
                    image_keywords: "soccer football stadium"
                },
            ],
            Crypto: [
                {
                    category: "Crypto",
                    bet: "Will Bitcoin reach $100,000 by the end of 2025?",
                    why: "Bitcoin has shown strong institutional adoption and ETF approval momentum. Market cycles and regulatory clarity could drive significant price movements in either direction.",
                    source_url: "https://coinmarketcap.com/currencies/bitcoin/",
                    image_keywords: "bitcoin cryptocurrency gold"
                },
            ],
            Politics: [
                {
                    category: "Politics",
                    bet: "Will voter turnout exceed 70% in the next presidential election?",
                    why: "Recent elections have seen historically high turnout rates. Mail-in voting expansion and increased political engagement could drive participation even higher.",
                    source_url: "https://www.census.gov/topics/public-sector/voting.html",
                    image_keywords: "voting ballot democracy"
                },
            ],
            Entertainment: [
                {
                    category: "Entertainment",
                    bet: "Will a streaming service surpass Netflix in global subscribers by 2026?",
                    why: "Disney+, Amazon Prime, and other platforms are investing heavily in content and international expansion. The streaming wars are intensifying with significant market shifts possible.",
                    source_url: "https://variety.com/streaming/",
                    image_keywords: "streaming television entertainment"
                },
            ],
            Misc: [
                {
                    category: "Misc",
                    bet: "Will lab-grown meat be sold in regular supermarkets by 2026?",
                    why: "Regulatory approvals are progressing and production costs are dropping. Consumer acceptance and price parity with traditional meat are key hurdles being addressed.",
                    source_url: "https://www.fda.gov/food/food-ingredients-packaging",
                    image_keywords: "laboratory food science"
                },
            ]
        };
        return betData[category] || betData.Sports;
    };

    const getSampleBets = (category) => {
        return generateSampleBets(category).map(bet => ({
            ...bet,
            enhancedWhy: bet.why + " This presents a unique opportunity for informed betting.",
            imageKeywords: bet.image_keywords || 'betting market',
            engagementPotential: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
        }));
    };

    const executeValidationAgent = (bets) => {
        return bets.map(bet => ({
            ...bet,
            validated: true,
            dataSource: bet.source_url || 'https://example.com/resolution-source'
        }));
    };

    const executeEnhancementAgent = (bets) => {
        return bets.map(bet => ({
            ...bet,
            enhancedWhy: bet.why + " This presents a unique opportunity for informed betting based on current market dynamics and trending indicators.",
            imageKeywords: bet.image_keywords || 'betting market analysis',
            engagementPotential: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
        }));
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
                        <button onClick={handleGenerateClick} className="btn btn--primary btn--lg btn--full-width" disabled={loading}>
                            {loading ? 'Generating...' : 'Generate Bets'}
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