import { ConnectKitButton } from "connectkit";
import { useAccount, useReadContract } from "wagmi";
import { PREDICTION_MARKET_FACTORY_ADDRESS, PREDICTION_MARKET_FACTORY_ABI } from "../constants";

export default function Home() {
  const { address, isConnected } = useAccount();

  const { data: predictionMarketFactoryContract, isLoading: isFactoryContractLoading } = useReadContract({
    address: PREDICTION_MARKET_FACTORY_ADDRESS,
    abi: PREDICTION_MARKET_FACTORY_ABI,
    functionName: 'name', // Assuming a simple function to check contract connection, replace with an actual function if needed
    enabled: isConnected, // Only fetch if connected
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <h1>Simple Web3 Connection Test</h1>
      <ConnectKitButton />
      {isConnected && (
        <p>Connected: {address}</p>
      )}
      {isConnected && !isFactoryContractLoading && predictionMarketFactoryContract && (
        <p>Connected to Prediction Market Factory Contract!</p>
      )}
      {isConnected && isFactoryContractLoading && (
        <p>Connecting to Prediction Market Factory Contract...</p>
      )}
      {isConnected && !isFactoryContractLoading && !predictionMarketFactoryContract && (
        <p>Failed to connect to Prediction Market Factory Contract.</p>
      )}
    </div>
  );
}