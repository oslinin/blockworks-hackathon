// Multi-Agent MCP Betting Generator - Orchestrated Agent System

class MultiAgentBettingGenerator {
    constructor() {
        // Default prompts for each agent
        this.defaultPrompts = {
            trendDiscovery: "You are a trend analysis specialist. Your job is to identify the top 3-5 trending topics in {CATEGORY} that would make compelling betting propositions. Focus on topics with:\n- Recent surge in interest\n- Upcoming events or deadlines  \n- Measurable outcomes\n- Broad public interest\nReturn an array of trending topics with estimated search volumes.",
            socialSentiment: "You are a social media analyst. Analyze the sentiment and discussion volume around these trending topics: {TOPICS}\n\nFor each topic, determine:\n- Overall sentiment (positive/negative/neutral)\n- Discussion volume (high/medium/low)\n- Key talking points and controversies\n- Likelihood of continued engagement\n\nReturn sentiment analysis data for each topic.",
            betGeneration: "You are an expert betting market maker. Using the trending topics and social sentiment data, create exactly 3 unique yes/no betting propositions.\n\nFor each bet, ensure:\n- Clear yes/no question format\n- Specific timeframe for resolution\n- Objective, measurable outcome\n- Appeals to current public interest\n\nReturn structured bet objects with question, timeframe, and category.",
            validation: "You are a betting compliance specialist. Validate these betting propositions for:\n- Clear, unambiguous resolution criteria\n- Reliable data sources for outcome verification\n- Appropriate timeframes (not too short/long)\n- No insider information advantages\n- Regulatory compliance\n\nFor each bet, provide or suggest a specific data source URL that will determine the outcome.",
            enhancement: "You are a content enhancement specialist. For each validated bet, add:\n- 2-3 sentences explaining why this bet is particularly interesting right now\n- 1-3 keywords suitable for Unsplash image search\n- Estimated engagement potential (High/Medium/Low)\n- Any additional context that makes the bet more compelling\n\nReturn the final enhanced betting propositions ready for display."
        };

        this.agentSequence = ['trendDiscovery', 'socialSentiment', 'betGeneration', 'validation', 'enhancement'];
        this.currentAgentIndex = -1;
        this.agentData = {};
        this.isProcessing = false;

        this.initializeElements();
        this.setupEventListeners();
        this.initializePrompts();
    }

    initializeElements() {
        this.categorySelect = document.getElementById('category-select');
        this.generateBtn = document.getElementById('generate-btn');
        this.workflowPanel = document.getElementById('workflow-panel');
        this.debugPanel = document.getElementById('debug-panel');
        this.debugMessages = document.getElementById('debug-messages');
        this.toggleDebugBtn = document.getElementById('toggle-debug');
        this.errorDisplay = document.getElementById('error-display');
        this.betCardsContainer = document.getElementById('bet-cards-container');

        // Get all prompt textareas and status badges
        this.promptElements = {};
        this.statusElements = {};

        this.agentSequence.forEach(agentId => {
            this.promptElements[agentId] = document.getElementById(`prompt-${agentId}`);
            this.statusElements[agentId] = document.getElementById(`status-${agentId}`);
        });

        console.log('Elements initialized successfully');
    }

    setupEventListeners() {
        if (this.generateBtn) {
            this.generateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.startAgentWorkflow();
            });
        }

        if (this.toggleDebugBtn) {
            this.toggleDebugBtn.addEventListener('click', () => {
                this.toggleDebugPanel();
            });
        }

        if (this.categorySelect) {
            this.categorySelect.addEventListener('change', () => {
                this.updatePromptsWithCategory();
            });
        }
    }

    initializePrompts() {
        // Initialize all prompt textareas with default prompts
        this.agentSequence.forEach(agentId => {
            if (this.promptElements[agentId]) {
                this.promptElements[agentId].value = this.defaultPrompts[agentId];
            }
        });
        this.updatePromptsWithCategory();
    }

    updatePromptsWithCategory() {
        const category = this.categorySelect?.value || 'Sports';

        // Update trend discovery prompt with current category
        if (this.promptElements.trendDiscovery) {
            const prompt = this.defaultPrompts.trendDiscovery.replace(/{CATEGORY}/g, category);
            this.promptElements.trendDiscovery.value = prompt;
        }
    }

    async startAgentWorkflow() {
        if (this.isProcessing) return;

        this.isProcessing = true;
        this.currentAgentIndex = -1;
        this.agentData = {};

        this.setLoadingState(true);
        this.showWorkflowPanel();
        this.showDebugPanel();
        this.hideError();
        this.clearBetCards();
        this.resetAgentStates();

        this.debugLog('🚀 Starting multi-agent workflow...', 'agent-start');

        try {
            const category = this.categorySelect?.value || 'Sports';
            this.debugLog(`📋 Category selected: ${category}`, 'agent-data');

            // Execute agents in sequence
            for (let i = 0; i < this.agentSequence.length; i++) {
                const agentId = this.agentSequence[i];
                this.currentAgentIndex = i;

                this.updateWorkflowProgress(agentId);
                this.setAgentStatus(agentId, 'processing');

                const result = await this.executeAgent(agentId, category);
                this.agentData[agentId] = result;

                this.setAgentStatus(agentId, 'complete');
                this.debugLog(`✅ ${this.getAgentName(agentId)} completed`, 'agent-complete');

                // Small delay between agents for visual effect
                await this.delay(500);
            }

            // Render final results
            if (this.agentData.enhancement) {
                await this.renderBetCards(this.agentData.enhancement);
                this.debugLog('🎯 Betting propositions rendered successfully', 'agent-complete');
            }

        } catch (error) {
            console.error('Workflow error:', error);
            this.debugLog(`❌ Workflow error: ${error.message}`, 'agent-error');
            this.showError('Agent workflow failed. Showing sample data instead.');

            // Fallback to sample data
            const sampleBets = this.getSampleBets();
            await this.renderBetCards(sampleBets);
        } finally {
            this.setLoadingState(false);
            this.isProcessing = false;
            this.currentAgentIndex = -1;
        }
    }

    async executeAgent(agentId, category) {
        this.debugLog(`🔄 Executing ${this.getAgentName(agentId)}...`, 'agent-start');

        // Simulate MCP-style API calls with realistic delays
        await this.delay(1000 + Math.random() * 2000);

        switch (agentId) {
            case 'trendDiscovery':
                return this.executeTrendDiscoveryAgent(category);
            case 'socialSentiment':
                return this.executeSocialSentimentAgent(category);
            case 'betGeneration':
                return this.executeBetGenerationAgent(category);
            case 'validation':
                return this.executeValidationAgent(category);
            case 'enhancement':
                return this.executeEnhancementAgent(category);
            default:
                throw new Error(`Unknown agent: ${agentId}`);
        }
    }

    async executeTrendDiscoveryAgent(category) {
        this.debugLog('📊 Simulating Google Trends API call...', 'agent-data');

        // Simulate Google Trends data
        const trends = this.getSimulatedTrends(category);
        this.debugLog(`📈 Found ${trends.length} trending topics`, 'agent-data');

        trends.forEach(trend => {
            this.debugLog(`  • ${trend.topic} (${trend.searchVolume} searches)`, 'agent-data');
        });

        return trends;
    }

    async executeSocialSentimentAgent(category) {
        this.debugLog('🐦 Simulating Twitter/X API call...', 'agent-data');

        const trends = this.agentData.trendDiscovery || [];
        const sentimentData = trends.map(trend => ({
            ...trend,
            sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)],
            discussionVolume: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
            engagement: Math.floor(Math.random() * 10000) + 1000
        }));

        this.debugLog(`💬 Analyzed sentiment for ${sentimentData.length} topics`, 'agent-data');
        sentimentData.forEach(data => {
            this.debugLog(`  • ${data.topic}: ${data.sentiment} sentiment, ${data.discussionVolume} volume`, 'agent-data');
        });

        return sentimentData;
    }

    async executeBetGenerationAgent(category) {
        this.debugLog('🎲 Generating betting propositions...', 'agent-data');

        // Generate 3 betting propositions based on previous agent data
        const bets = this.generateSampleBets(category);
        this.debugLog(`🎯 Generated ${bets.length} betting propositions`, 'agent-data');

        bets.forEach((bet, index) => {
            this.debugLog(`  ${index + 1}. ${bet.bet}`, 'agent-data');
        });

        return bets;
    }

    async executeValidationAgent(category) {
        this.debugLog('🔍 Validating betting propositions...', 'agent-data');

        const bets = this.agentData.betGeneration || [];
        const validatedBets = bets.map(bet => ({
            ...bet,
            validated: true,
            resolutionCriteria: 'Clear and objective resolution criteria verified',
            dataSource: bet.source_url || 'https://example.com/resolution-source'
        }));

        this.debugLog(`✓ Validated ${validatedBets.length} betting propositions`, 'agent-data');
        this.debugLog('  • Resolution criteria verified', 'agent-data');
        this.debugLog('  • Data sources confirmed', 'agent-data');

        return validatedBets;
    }

    async executeEnhancementAgent(category) {
        this.debugLog('✨ Enhancing content and engagement...', 'agent-data');

        const validatedBets = this.agentData.validation || [];
        const enhancedBets = validatedBets.map(bet => ({
            ...bet,
            engagementPotential: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
            enhancedWhy: this.enhanceWhyText(bet.why),
            imageKeywords: bet.image_keywords || this.generateImageKeywords(bet.bet)
        }));

        this.debugLog(`🚀 Enhanced ${enhancedBets.length} betting propositions`, 'agent-data');
        enhancedBets.forEach(bet => {
            this.debugLog(`  • ${bet.bet} - ${bet.engagementPotential} engagement potential`, 'agent-data');
        });

        return enhancedBets;
    }

    getSimulatedTrends(category) {
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
    }

    generateSampleBets(category) {
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
                {
                    category: "Sports",
                    bet: "Will a new world record be set in the men's 100m this year?",
                    why: "Several sprinters are running incredibly fast times this season. The competition is heating up with new training methods and technology potentially breaking barriers.",
                    source_url: "https://worldathletics.org/records",
                    image_keywords: "running track athletics"
                }
            ],
            Crypto: [
                {
                    category: "Crypto",
                    bet: "Will Bitcoin reach $100,000 by the end of 2025?",
                    why: "Bitcoin has shown strong institutional adoption and ETF approval momentum. Market cycles and regulatory clarity could drive significant price movements in either direction.",
                    source_url: "https://coinmarketcap.com/currencies/bitcoin/",
                    image_keywords: "bitcoin cryptocurrency gold"
                },
                {
                    category: "Crypto",
                    bet: "Will Ethereum 2.0 staking rewards exceed 5% APY this year?",
                    why: "Ethereum's proof-of-stake transition continues to evolve. Network activity, inflation rates, and validator participation all impact staking yields significantly.",
                    source_url: "https://ethereum.org/en/staking/",
                    image_keywords: "ethereum blockchain network"
                },
                {
                    category: "Crypto",
                    bet: "Will a central bank digital currency launch in the US by 2026?",
                    why: "The Federal Reserve has been researching CBDCs extensively. Political pressure, competition with other nations, and technological readiness are key factors to watch.",
                    source_url: "https://www.federalreserve.gov/cbdc-faqs.htm",
                    image_keywords: "digital money banking"
                }
            ],
            Politics: [
                {
                    category: "Politics",
                    bet: "Will voter turnout exceed 70% in the next presidential election?",
                    why: "Recent elections have seen historically high turnout rates. Mail-in voting expansion and increased political engagement could drive participation even higher.",
                    source_url: "https://www.census.gov/topics/public-sector/voting.html",
                    image_keywords: "voting ballot democracy"
                },
                {
                    category: "Politics",
                    bet: "Will climate change be a top 3 campaign issue in 2028?",
                    why: "Environmental concerns are increasingly prominent in political discourse. Extreme weather events and generational shifts in priorities could make this a defining campaign issue.",
                    source_url: "https://www.pewresearch.org/politics/",
                    image_keywords: "climate environment politics"
                },
                {
                    category: "Politics",
                    bet: "Will a third political party win any electoral votes in 2028?",
                    why: "Political polarization and dissatisfaction with major parties is growing. Independent and third-party movements are gaining momentum in several states.",
                    source_url: "https://www.fec.gov/introduction-campaign-finance/",
                    image_keywords: "political party election"
                }
            ],
            Entertainment: [
                {
                    category: "Entertainment",
                    bet: "Will a streaming service surpass Netflix in global subscribers by 2026?",
                    why: "Disney+, Amazon Prime, and other platforms are investing heavily in content and international expansion. The streaming wars are intensifying with significant market shifts possible.",
                    source_url: "https://variety.com/streaming/",
                    image_keywords: "streaming television entertainment"
                },
                {
                    category: "Entertainment",
                    bet: "Will AI-generated content win a major film award by 2027?",
                    why: "AI technology in film production is advancing rapidly. From scriptwriting to visual effects, AI tools are becoming sophisticated enough to create award-worthy content.",
                    source_url: "https://www.oscars.org/",
                    image_keywords: "artificial intelligence movie film"
                },
                {
                    category: "Entertainment",
                    bet: "Will virtual concerts generate more revenue than live concerts by 2026?",
                    why: "Post-pandemic shifts in entertainment consumption and advancing VR/AR technology are changing how people experience music. Cost efficiency and global reach favor virtual events.",
                    source_url: "https://www.pollstar.com/",
                    image_keywords: "virtual reality concert music"
                }
            ],
            Misc: [
                {
                    category: "Misc",
                    bet: "Will lab-grown meat be sold in regular supermarkets by 2026?",
                    why: "Regulatory approvals are progressing and production costs are dropping. Consumer acceptance and price parity with traditional meat are key hurdles being addressed.",
                    source_url: "https://www.fda.gov/food/food-ingredients-packaging",
                    image_keywords: "laboratory food science"
                },
                {
                    category: "Misc",
                    bet: "Will a private company successfully land humans on Mars by 2030?",
                    why: "SpaceX and other companies are making significant progress on Mars mission technology. Engineering challenges and funding timelines will determine feasibility.",
                    source_url: "https://www.nasa.gov/humans-in-space/mars/",
                    image_keywords: "mars planet space"
                },
                {
                    category: "Misc",
                    bet: "Will autonomous vehicles account for 50%+ of new car sales by 2030?",
                    why: "Self-driving technology is improving rapidly while regulatory frameworks are evolving. Consumer adoption rates and safety records will be critical factors.",
                    source_url: "https://www.nhtsa.gov/vehicle/automated-vehicles",
                    image_keywords: "autonomous car technology"
                }
            ]
        };

        return betData[category] || betData.Sports;
    }

    getSampleBets() {
        const category = this.categorySelect?.value || 'Sports';
        return this.generateSampleBets(category);
    }

    enhanceWhyText(originalWhy) {
        return originalWhy + " This presents a unique opportunity for informed betting based on current market dynamics and trending indicators.";
    }

    generateImageKeywords(betText) {
        const keywords = {
            'NBA': 'basketball court NBA',
            'soccer': 'soccer football stadium',
            'Bitcoin': 'bitcoin cryptocurrency gold',
            'Ethereum': 'ethereum blockchain network',
            'election': 'voting ballot democracy',
            'streaming': 'streaming television entertainment',
            'Mars': 'mars planet space'
        };

        for (const [key, value] of Object.entries(keywords)) {
            if (betText.toLowerCase().includes(key.toLowerCase())) {
                return value;
            }
        }

        return 'betting market analysis';
    }

    // UI Management Methods
    updateWorkflowProgress(currentAgentId) {
        // Update workflow visualization
        const steps = document.querySelectorAll('.workflow-step');
        steps.forEach(step => {
            step.classList.remove('active', 'complete');
        });

        // Mark completed steps
        const currentIndex = this.agentSequence.indexOf(currentAgentId);
        for (let i = 0; i < currentIndex; i++) {
            const step = document.querySelector(`[data-step="${this.agentSequence[i]}"]`);
            if (step) step.classList.add('complete');
        }

        // Mark current step as active
        const currentStep = document.querySelector(`[data-step="${currentAgentId}"]`);
        if (currentStep) currentStep.classList.add('active');

        // Update agent section visual state
        document.querySelectorAll('.agent-section').forEach(section => {
            section.classList.remove('active');
        });

        const currentSection = document.querySelector(`[data-agent="${currentAgentId}"]`);
        if (currentSection) currentSection.classList.add('active');
    }

    setAgentStatus(agentId, status) {
        const statusElement = this.statusElements[agentId];
        if (statusElement) {
            statusElement.className = `status-badge ${status}`;
            statusElement.textContent = status;
        }
    }

    resetAgentStates() {
        this.agentSequence.forEach(agentId => {
            this.setAgentStatus(agentId, 'waiting');
        });

        document.querySelectorAll('.agent-section').forEach(section => {
            section.classList.remove('active');
        });

        document.querySelectorAll('.workflow-step').forEach(step => {
            step.classList.remove('active', 'complete');
        });
    }

    debugLog(message, type = 'agent-data') {
        if (!this.debugMessages) return;

        const messageElement = document.createElement('div');
        messageElement.className = `debug-message ${type}`;
        messageElement.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;

        this.debugMessages.appendChild(messageElement);
        this.debugMessages.scrollTop = this.debugMessages.scrollHeight;
    }

    showWorkflowPanel() {
        if (this.workflowPanel) {
            this.workflowPanel.classList.remove('hidden');
        }
    }

    showDebugPanel() {
        if (this.debugPanel) {
            this.debugPanel.classList.remove('hidden');
            if (this.debugMessages) {
                this.debugMessages.innerHTML = '';
            }
        }
    }

    toggleDebugPanel() {
        if (this.debugPanel) {
            this.debugPanel.classList.toggle('hidden');
            if (this.toggleDebugBtn) {
                this.toggleDebugBtn.textContent = this.debugPanel.classList.contains('hidden') ? 'Show' : 'Hide';
            }
        }
    }

    setLoadingState(isLoading) {
        if (!this.generateBtn) return;

        if (isLoading) {
            this.generateBtn.classList.add('loading');
            this.generateBtn.disabled = true;
        } else {
            this.generateBtn.classList.remove('loading');
            this.generateBtn.disabled = false;
        }
    }

    showError(message) {
        if (!this.errorDisplay) return;

        this.errorDisplay.textContent = message;
        this.errorDisplay.classList.remove('hidden');
    }

    hideError() {
        if (!this.errorDisplay) return;

        this.errorDisplay.classList.add('hidden');
    }

    clearBetCards() {
        if (!this.betCardsContainer) return;

        this.betCardsContainer.innerHTML = '';
    }

    getAgentName(agentId) {
        const names = {
            trendDiscovery: 'Trend Discovery Agent',
            socialSentiment: 'Social Sentiment Agent',
            betGeneration: 'Bet Generation Agent',
            validation: 'Validation Agent',
            enhancement: 'Enhancement Agent'
        };
        return names[agentId] || agentId;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Bet Card Rendering
    async renderBetCards(bets) {
        if (!this.betCardsContainer) return;

        this.betCardsContainer.innerHTML = '';

        for (const bet of bets) {
            const cardElement = await this.createBetCard(bet);
            this.betCardsContainer.appendChild(cardElement);
        }
    }

    async createBetCard(bet) {
        const card = document.createElement('div');
        card.className = 'bet-card fade-in';

        // Create image URL using fallback approach
        const imageKeywords = bet.imageKeywords || bet.image_keywords || 'betting market';
        const cleanKeywords = imageKeywords.replace(/[^a-zA-Z0-9\s]/g, '').trim();
        const fallbackImageUrl = `https://picsum.photos/800/500?random=${Math.floor(Math.random() * 1000)}`;
        const unsplashViewUrl = `https://unsplash.com/search/photos?query=${encodeURIComponent(cleanKeywords)}`;

        card.innerHTML = `
            <div class="bet-card-image loading">
                <div class="image-loader"></div>
            </div>
            <div class="bet-card-content">
                <span class="category-badge">${bet.category}</span>
                <h3 class="bet-question">${bet.bet}</h3>
                <p class="bet-why">${bet.enhancedWhy || bet.why}</p>
                <a href="${bet.dataSource || bet.source_url}" target="_blank" rel="noopener noreferrer" class="resolution-source">
                    Resolution Source
                </a>
            </div>
        `;

        // Load image asynchronously
        const imageContainer = card.querySelector('.bet-card-image');
        this.loadImage(fallbackImageUrl, unsplashViewUrl, imageContainer, cleanKeywords);

        return card;
    }

    async loadImage(imageUrl, unsplashViewUrl, container, keywords) {
        try {
            const img = new Image();

            img.onload = () => {
                container.innerHTML = `
                    <a href="${unsplashViewUrl}" target="_blank" rel="noopener noreferrer">
                        <img src="${imageUrl}" alt="Illustration for ${keywords}" />
                    </a>
                `;
                container.classList.remove('loading');
            };

            img.onerror = () => {
                // Final fallback to CSS background
                container.innerHTML = `
                    <a href="${unsplashViewUrl}" target="_blank" rel="noopener noreferrer">
                        <div style="
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: var(--color-btn-primary-text);
                            font-size: var(--font-size-lg);
                            font-weight: var(--font-weight-semibold);
                            text-align: center;
                            padding: var(--space-16);
                        ">
                            ${keywords.charAt(0).toUpperCase() + keywords.slice(1)}
                        </div>
                    </a>
                `;
                container.classList.remove('loading');
            };

            // Add timeout to prevent infinite loading
            setTimeout(() => {
                if (container.classList.contains('loading')) {
                    img.onerror();
                }
            }, 5000);

            img.src = imageUrl;

        } catch (error) {
            console.error('Error in loadImage:', error);
            container.innerHTML = `
                <a href="${unsplashViewUrl}" target="_blank" rel="noopener noreferrer">
                    <div style="
                        width: 100%;
                        height: 100%;
                        background: var(--color-bg-3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: var(--color-text-secondary);
                        font-size: var(--font-size-sm);
                    ">
                        Click to view images
                    </div>
                </a>
            `;
            container.classList.remove('loading');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Multi-Agent MCP application...');
    try {
        window.multiAgentApp = new MultiAgentBettingGenerator();
        console.log('Multi-Agent MCP application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
});

// Export for potential future use
window.MultiAgentBettingGenerator = MultiAgentBettingGenerator;
