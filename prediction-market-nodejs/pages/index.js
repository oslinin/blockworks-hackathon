import { useEffect, useState } from "react";
import { useAddress, useProvider } from "@thirdweb-dev/react";
import ConnectButton from "../components/ConnectButton";
import MarketDisplay from "../components/MarketDisplay";
import { calculateUserScore } from "../utils/UserScore";

export default function Home() {
  const address = useAddress();
  const provider = useProvider();
  const [userScore, setUserScore] = useState({});

  useEffect(() => {
    if (address && provider) {
      const fetchUserScore = async () => {
        const score = await calculateUserScore(provider, address);
        setUserScore(score);
        console.log("User Score:", score);
      };
      fetchUserScore();
    }
  }, [address, provider]);

  return (
    <div>
      <h1>Hello World!</h1>
      <ConnectButton />
      {address && (
        <div>
          <h2>Your User Score:</h2>
          <pre>{JSON.stringify(userScore, null, 2)}</pre>
        </div>
      )}
      <MarketDisplay userScore={userScore} setUserScore={setUserScore} />
    </div>
  );
}