import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWalletClient } from 'wagmi';
import { ethers } from "ethers";
import PredictionMarketFactoryABI from "../../abi/PredictionMarketFactory.json";
import PredictionMarketABI from "../../abi/PredictionMarket.json";
import { calculateUserScore } from "../../utils/UserScore";
import { generateBet } from "../../prediction-agent/index.js";

const PREDICTION_MARKET_FACTORY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const categoryMap = {
  0: "Sports",
  1: "Elections",
  2: "Crypto",
};

export default function MarketDisplay({ userScore, setUserScore }) {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const { data: allMarketAddresses, isLoading: isLoadingMarkets } = useReadContract({
    address: PREDICTION_MARKET_FACTORY_ADDRESS,
    abi: PredictionMarketFactoryABI,
    functionName: 'getAllMarkets',
  });

  const [markets, setMarkets] = useState([]);
  const [currentMarketIndex, setCurrentMarketIndex] = useState(0);
  const [loadingBet, setLoadingBet] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [outstandingBets, setOutstandingBets] = useState([]);

  useEffect(() => {
    const fetchMarketDetails = async () => {
      if (allMarketAddresses && walletClient) {
        const fetchedMarkets = [];
        for (const marketAddress of allMarketAddresses) {
          try {
            const marketContract = new ethers.Contract(marketAddress, PredictionMarketABI, walletClient);
            const question = await marketContract.name();
            const category = await marketContract.marketCategory();
            const [yesProb, noProb] = await marketContract.getProbability();
            const yesPool = await marketContract.yesPool();
            const noPool = await marketContract.noPool();
            const resolved = await marketContract.resolved();

            // Check if user has participated
            let hasParticipated = false;
            if (address) {
              const yesTokenAddress = await marketContract.yesToken();
              const noTokenAddress = await marketContract.noToken();
              const yesTokenContract = new ethers.Contract(yesTokenAddress, PredictionMarketABI, walletClient); // Using PredictionMarketABI for ERC20 functions
              const noTokenContract = new ethers.Contract(noTokenAddress, PredictionMarketABI, walletClient); // Using PredictionMarketABI for ERC20 functions

              const yesBalance = await yesTokenContract.balanceOf(address);
              const noBalance = await noTokenContract.balanceOf(address);
              if (yesBalance > 0n || noBalance > 0n) {
                hasParticipated = true;
              }
            }

            fetchedMarkets.push({
              address: marketAddress,
              question,
              category: categoryMap[category],
              yesProbability: yesProb.toString(),
              noProbability: noProb.toString(),
              yesPool: yesPool.toString(),
              noPool: noPool.toString(),
              resolved,
              hasParticipated,
            });
          } catch (error) {
            console.error("Error fetching market details for", marketAddress, error);
          }
        }
        setMarkets(fetchedMarkets);
      }
    };

    fetchMarketDetails();
  }, [allMarketAddresses, walletClient, address]);

  const currentMarket = markets[currentMarketIndex];

  const handleBet = async (betOnYes) => {
    if (!address || !walletClient || !currentMarket) return;

    setLoadingBet(true);
    try {
      const marketContract = new ethers.Contract(currentMarket.address, PredictionMarketABI, walletClient);
      const usdcAddress = await marketContract.USDC();
      const usdcContract = new ethers.Contract(usdcAddress, PredictionMarketABI, walletClient); // Using PredictionMarketABI for ERC20 functions

      const betAmount = ethers.parseUnits("1", 6); // 1 USDC

      // Approve USDC transfer
      const approveTx = await usdcContract.approve(currentMarket.address, betAmount);
      await approveTx.wait();

      // Place bet
      const placeBetTx = await marketContract.placeBet(betAmount, betOnYes);
      await placeBetTx.wait();

      // Recalculate user score
      const updatedUserScore = await calculateUserScore(walletClient.provider, address);
      setUserScore(updatedUserScore);

      // Move to next market
      moveToNextMarket();
    } catch (error) {
      console.error("Error placing bet:", error);
      alert("Failed to place bet. Check console for details.");
    } finally {
      setLoadingBet(false);
    }
  };

  const moveToNextMarket = async () => {
    if (currentMarketIndex < markets.length - 1) {
      setCurrentMarketIndex(currentMarketIndex + 1);
    } else {
      // Fetch new bet from prediction-agent
      setLoadingBet(true);
      try {
        const newBet = await generateBet();
        if (newBet) {
          // For now, we'll just log the new bet. In a real app, you'd create a new market on-chain.
          console.log("New bet from agent:", newBet);
          alert("New bet generated by agent. (See console)");
        } else {
          alert("No new bet generated by agent.");
        }
      } catch (error) {
        console.error("Error fetching new bet from agent:", error);
        alert("Failed to fetch new bet from agent.");
      } finally {
        setLoadingBet(false);
      }
      setCurrentMarketIndex(0); // Loop back to start for now
    }
  };

  const toggleHistory = async () => {
    if (!showHistory) {
        const factoryContract = new ethers.Contract(PREDICTION_MARKET_FACTORY_ADDRESS, PredictionMarketFactoryABI, walletClient);
        const bets = await factoryContract.getAllBets();
        setOutstandingBets(bets);
    }
    setShowHistory(!showHistory);
  };

  if (isLoadingMarkets) {
    return <div>Loading markets...</div>;
  }

  if (markets.length === 0) {
    return <div>No markets available.</div>;
  }

  return (
    <div>
      <h2>Current Market:</h2>
      {currentMarket ? (
        <div>
          <h3>{currentMarket.question}</h3>
          <p>Category: {currentMarket.category}</p>
          <p>Yes Probability: {currentMarket.yesProbability / 100}%</p>
          <p>No Probability: {currentMarket.noProbability / 100}%</p>
          <p>Yes Pool: {ethers.formatUnits(currentMarket.yesPool, 6)}</p>
          <p>No Pool: {ethers.formatUnits(currentMarket.noPool, 6)}</p>
          <p>Resolved: {currentMarket.resolved ? "Yes" : "No"}</p>
          <p>Participated: {currentMarket.hasParticipated ? "Yes" : "No"}</p>

          {!currentMarket.resolved && !currentMarket.hasParticipated && address && (
            <div>
              <button onClick={() => handleBet(true)} disabled={loadingBet}>Bet Yes</button>
              <button onClick={() => handleBet(false)} disabled={loadingBet}>Bet No</button>
              <button onClick={moveToNextMarket} disabled={loadingBet}>Pass</button>
            </div>
          )}
          {(currentMarket.resolved || currentMarket.hasParticipated) && (
            <button onClick={moveToNextMarket} disabled={loadingBet}>Next Market</button>
          )}
        </div>
      ) : (
        <div>No market selected.</div>
      )}

      <button onClick={toggleHistory}>
        {showHistory ? "Hide History" : "Show History"}
      </button>

      {showHistory && (
        <div>
          <h3>Outstanding Bets (Market Addresses):</h3>
          {outstandingBets.length > 0 ? (
            <ul>
              {outstandingBets.map((betAddress, index) => (
                <li key={index}>{betAddress}</li>
              ))}
            </ul>
          ) : (
            <p>No outstanding bets.</p>
          )}
        </div>
      )}
    </div>
  );
}
