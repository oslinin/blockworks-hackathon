import { ethers } from "ethers";
import PredictionMarketFactoryABI from "../abi/PredictionMarketFactory.json"; // Assuming ABI will be generated

// Placeholder for the deployed PredictionMarketFactory address
// This will need to be updated with the actual deployed address after deployment
const PREDICTION_MARKET_FACTORY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

export async function calculateUserScore(provider, userAddress) {
  if (!provider || !userAddress) {
    console.warn("Provider or user address not available for UserScore calculation.");
    return {};
  }

  const factoryContract = new ethers.Contract(
    PREDICTION_MARKET_FACTORY_ADDRESS,
    PredictionMarketFactoryABI,
    provider
  );

  const betPlacedFilter = factoryContract.filters.BetPlaced(userAddress);
  const events = await factoryContract.queryFilter(betPlacedFilter);

  const categoryFrequencies = {};

  events.forEach(event => {
    const category = event.args.category;
    categoryFrequencies[category] = (categoryFrequencies[category] || 0) + 1;
  });

  // Convert frequencies to probabilities (UserScore)
  const totalBets = Object.values(categoryFrequencies).reduce((sum, count) => sum + count, 0);
  const userScore = {};
  for (const category in categoryFrequencies) {
    userScore[category] = categoryFrequencies[category] / totalBets;
  }

  return userScore;
}
