import { useState, useEffect } from "react";
import { useWeb3 } from "../context/Web3Context";
import { ethers } from "ethers";
import PredictionMarketFactoryABI from "../abi/PredictionMarketFactory.json";
import PredictionMarketABI from "../abi/PredictionMarket.json";
import MintableERC20ABI from "../abi/MintableERC20.json";
import OfficialUSDC from '../abi/OfficialUSDC.json';
import contractAddresses from "../abi/contract-addresses.json";
import Button from "./Button";

const getAddresses = async (provider) => {
    if (provider) {
        const network = await provider.getNetwork();
        return network.chainId === 31337 ? contractAddresses.localhost : contractAddresses.sepolia;
    }
    return contractAddresses.localhost;
};

const getUsdcAbi = async (provider) => {
    if (provider) {
        const network = await provider.getNetwork();
        return network.chainId === 31337 ? MintableERC20ABI : OfficialUSDC;
    }
    return MintableERC20ABI;
};

const categoryMap = {
  0: "Sports",
  1: "Elections",
  2: "Crypto",
};

export default function MarketDisplay() {
  const { account, provider, signer } = useWeb3();
  const [addresses, setAddresses] = useState(null);
  const [USDC_ABI, setUsdcAbi] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [currentMarketIndex, setCurrentMarketIndex] = useState(0);
  const [loadingBet, setLoadingBet] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [outstandingBets, setOutstandingBets] = useState([]);
  const [isLoadingMarkets, setIsLoadingMarkets] = useState(true);

  useEffect(() => {
      const setup = async () => {
          if (provider) {
              const addrs = await getAddresses(provider);
              setAddresses(addrs);
              const abi = await getUsdcAbi(provider);
              setUsdcAbi(abi);
          }
      };
      setup();
  }, [provider]);

  useEffect(() => {
    const fetchMarkets = async () => {
      if (addresses && provider) {
        try {
          const factoryContract = new ethers.Contract(addresses.PredictionMarketFactory, PredictionMarketFactoryABI, provider);
          const allMarketAddresses = await factoryContract.getAllMarkets();
          const fetchedMarkets = [];
          for (const marketAddress of allMarketAddresses) {
            try {
              const marketContract = new ethers.Contract(marketAddress, PredictionMarketABI, signer);
              const question = await marketContract.name();
              const category = await marketContract.marketCategory();
              const yesProb = await marketContract.getProbability();
              const yesPool = await marketContract.yesPool();
              const noPool = await marketContract.noPool();
              const resolved = await marketContract.resolved();

              // Check if user has participated
              let hasParticipated = false;
              if (account) {
                const yesTokenAddress = await marketContract.yesToken();
                const noTokenAddress = await marketContract.noToken();
                const yesTokenContract = new ethers.Contract(yesTokenAddress, USDC_ABI, signer);
                const noTokenContract = new ethers.Contract(noTokenAddress, USDC_ABI, signer);

                const yesBalance = await yesTokenContract.balanceOf(account);
                const noBalance = await noTokenContract.balanceOf(account);
                if (yesBalance > 0n || noBalance > 0n) {
                  hasParticipated = true;
                }
              }

              fetchedMarkets.push({
                address: marketAddress,
                question,
                category: categoryMap[category],
                yesProbability: yesProb.toString(),
                noProbability: (ethers.parseUnits("100", 18) - yesProb).toString(),
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
        } catch (error) {
          console.error("Error fetching markets:", error);
        } finally {
          setIsLoadingMarkets(false);
        }
      }
    };

    fetchMarkets();
  }, [addresses, provider, signer, account, USDC_ABI]);

  const currentMarket = markets[currentMarketIndex];

  const handleBet = async (betOnYes) => {
    if (!account || !signer || !currentMarket) return;

    setLoadingBet(true);
    try {
      const marketContract = new ethers.Contract(currentMarket.address, PredictionMarketABI, signer);
      const usdcAddress = await marketContract.usdcToken();
      const usdcContract = new ethers.Contract(usdcAddress, USDC_ABI, signer);

      const betAmount = ethers.parseUnits("1", 6); // 1 USDC

      // Approve USDC transfer
      const approveTx = await usdcContract.approve(currentMarket.address, betAmount);
      await approveTx.wait();

      // Place bet
      const placeBetTx = await marketContract.bet(betAmount, betOnYes);
      await placeBetTx.wait();

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
      setCurrentMarketIndex(0); // Loop back to start
    }
  };

  const toggleHistory = async () => {
    if (!showHistory) {
      if (addresses && provider) {
        const factoryContract = new ethers.Contract(addresses.PredictionMarketFactory, PredictionMarketFactoryABI, provider);
        setOutstandingBets([]);
      }
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

          {!currentMarket.resolved && !currentMarket.hasParticipated && account && (
            <div>
              <Button onClick={() => handleBet(true)} disabled={loadingBet}>Bet Yes</Button>
              <Button onClick={() => handleBet(false)} disabled={loadingBet} className="ml-2">Bet No</Button>
              <Button onClick={moveToNextMarket} disabled={loadingBet} className="ml-2">Pass</Button>
            </div>
          )}
          {(currentMarket.resolved || currentMarket.hasParticipated) && (
            <Button onClick={moveToNextMarket} disabled={loadingBet} className="mt-2">Next Market</Button>
          )}
        </div>
      ) : (
        <div>No market selected.</div>
      )}

      <Button onClick={toggleHistory} className="mt-4">
        {showHistory ? "Hide History" : "Show History"}
      </Button>

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