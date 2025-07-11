const { expect } = require("chai");
const { getPrediction } = require("../index");

describe("Prediction Agent", function () {
    it("should return a valid prediction object", async function () {
        this.timeout(20000); // Increase timeout for API call
        if (!process.env.GEMINI_API_KEY) {
            this.skip();
        }

        const prediction = await getPrediction("crypto");
        console.log(prediction);
        expect(prediction).to.have.property("question");
        expect(prediction).to.have.property("type", "binary");
        expect(prediction).to.have.property("tags").that.is.an('array').that.includes("crypto");
        expect(prediction).to.have.property("resolution_source");
        expect(prediction).to.have.property("deadline");
        expect(prediction).to.have.property("creator", "auto-gen");
    });
});
