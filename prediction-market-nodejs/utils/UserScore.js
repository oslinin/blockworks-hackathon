import { ethers } from 'ethers';

const FACTORY_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const FACTORY_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"marketAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"bool","name":"onYes","type":"bool"}],"name":"BetPlaced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"marketAddress","type":"address"},{"indexed":false,"internalType":"string","name":"question","type":"string"},{"indexed":false,"internalType":"enum PredictionMarket.Category","name":"category","type":"uint8"}],"name":"MarketCreated","type":"event"},{"inputs":[{"internalType":"string","name":"_question","type":"string"},{"internalType":"enum PredictionMarket.Category","name":"_category","type":"uint8"},{"internalType":"address","name":"_oracle","type":"address"},{"internalType":"address","name":"_usdcToken","type":"address"},{"internalType":"string","name":"_yesTokenName","type":"string"},{"internalType":"string","name":"_yesTokenSymbol","type":"string"},{"internalType":"string","name":"_noTokenName","type":"string"},{"internalType":"string","name":"_noTokenSymbol","type":"string"}],"name":"createMarket","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllMarkets","outputs":[{"internalType":"contract PredictionMarket[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"enum PredictionMarket.Category","name":"_category","type":"uint8"}],"name":"getMarketsByCategory","outputs":[{"internalType":"contract PredictionMarket[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"predictionMarkets","outputs":[{"internalType":"contract PredictionMarket","name":"","type":"address"}],"stateMutability":"view","type":"function"}];

export const calculateUserScore = async (provider, userAddress) => {
    const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
    const filter = factoryContract.filters.BetPlaced(userAddress);
    const events = await factoryContract.queryFilter(filter);

    const categoryCounts = {
        ELECTION: 0,
        SPORTS: 0,
        CRYPTO: 0,
        TV: 0,
    };

    for (const event of events) {
        const marketAddress = event.args.marketAddress;
        const marketContract = new ethers.Contract(marketAddress, MARKET_ABI, provider);
        const category = await marketContract.category();
        
        if (category === 0) categoryCounts.ELECTION++;
        else if (category === 1) categoryCounts.SPORTS++;
        else if (category === 2) categoryCounts.CRYPTO++;
        else if (category === 3) categoryCounts.TV++;
    }

    const totalBets = events.length;
    const userScore = {};
    for (const category in categoryCounts) {
        userScore[category] = totalBets > 0 ? categoryCounts[category] / totalBets : 0;
    }

    return userScore;
};