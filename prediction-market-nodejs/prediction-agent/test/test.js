const { expect } = require("chai");
const sinon = require("sinon");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { generateBet } = require("../index");

describe("Prediction Agent", function () {
    let sandbox;
    let generateContentStub;

    beforeEach(function () {
        sandbox = sinon.createSandbox();
        generateContentStub = sandbox.stub().resolves({
            response: {
                text: () => JSON.stringify({
                    question: "Will the price of Ethereum exceed $4000 by the end of 2025?",
                    type: "binary",
                    category: ["crypto", "Ethereum"],
                    resolution_source: "https://coinmarketcap.com",
                    deadline: "2025-12-31T23:59:59Z",
                    creator: "auto-gen"
                })
            }
        });

        sandbox.stub(GoogleGenerativeAI.prototype, "getGenerativeModel").returns({
            generateContent: generateContentStub
        });

        // Set a dummy API key for testing
        process.env.GEMINI_API_KEY = "TEST_API_KEY";
    });

    afterEach(function () {
        sandbox.restore();
        delete process.env.GEMINI_API_KEY;
    });

    it("should generate a bet in the correct format", async function () {
        const bet = await generateBet();

        expect(bet).to.be.an("object");
        expect(bet).to.have.all.keys(
            "question",
            "type",
            "category",
            "resolution_source",
            "deadline",
            "creator"
        );
        expect(bet.type).to.equal("binary");
        expect(bet.category).to.be.an("array");
    });

    it("should include the category in the prompt if provided", async function () {
        const category = "sports";
        await generateBet(category);

        const expectedPrompt = `You are a prediction market assistant. Given the category I give you (sports, election or crypto):

Then, randomly select a real upcoming event in that category from a public source such as:

- Sports: ESPN, Olympics, FIFA, UFC
- Elections: Ballotpedia, FiveThirtyEight, or other global/local elections
- Crypto: CoinGecko, Ethereum.org, Bitcoin halving, SEC ETF decisions

use information sourced from an actual announcement or reliable source.

Based on the selected event, generate a prediction market bet as a JSON object with the following fields:

{
"question": "Will [EVENT] happen on or before [DATE]?",
"type": "binary",
"tags": ["category"],
"resolution_source": "[source or URL]",
"deadline": "[YYYY-MM-DD]",
"creator": "auto-gen"
}

Requirements:

- Make sure the event is real and date-bounded. Make sure it is in the future and it is real. If the event is tied to a specific known date (e.g. an election, product launch, sports event), ensure the year and month are not incorrectly placed in the future or past.
- The question must be clearly answerable with YES or NO.
- The resolution_source must be real or realistically plausible.
- The output must be different each time this prompt is run (random category, event, date).
- Output only the JSON. No explanation or commentary.
  
Focus on the 'sports' category.`

        expect(generateContentStub.calledWith(expectedPrompt)).to.be.true;
    });

    it("should return null if an error occurs", async function () {
        generateContentStub.rejects(new Error("API Error"));
        const bet = await generateBet();
        expect(bet).to.be.null;
    });
});
