const { expect } = require("chai");
const { ethers } = require("ethers");
const { calculateUserScore } = require("../utils/UserScore");

describe("UserScore", function () {
    it("should calculate the user score correctly", async function () {
        this.timeout(60000); // Increase timeout for blockchain operations

        // This test requires a running hardhat node with contracts deployed.
        // You also need to have placed some bets from the user's account.
        // For the purpose of this test, we will simulate this.

        // 1. Setup provider and user address
        const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
        const userAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Hardhat account 0

        // 2. We can't easily place bets here, so we will assume the function works
        //    and we are testing the calculation logic based on a mocked event stream.
        //    A more comprehensive test would involve deploying contracts and placing bets.

        const mockProvider = {
            getLogs: async (filter) => {
                // Simulate some BetPlaced events
                return [
                    { args: { marketAddress: "0xMarket1", category: 0 } }, // ELECTION
                    { args: { marketAddress: "0xMarket2", category: 1 } }, // SPORTS
                    { args: { marketAddress: "0xMarket3", category: 0 } }, // ELECTION
                    { args: { marketAddress: "0xMarket4", category: 2 } }, // CRYPTO
                ];
            }
        };
        
        const mockMarketContract = {
            category: async () => 0, // Mock category, will be overridden in the loop
        };

        const score = await calculateUserScore(mockProvider, userAddress);

        // In our mock, we have 2 ELECTION, 1 SPORTS, 1 CRYPTO
        // Total bets = 4
        // Expected score: ELECTION: 0.5, SPORTS: 0.25, CRYPTO: 0.25, TV: 0
        expect(score.ELECTION).to.equal(0.5);
        expect(score.SPORTS).to.equal(0.25);
        expect(score.CRYPTO).to.equal(0.25);
        expect(score.TV).to.equal(0);
    });
});
