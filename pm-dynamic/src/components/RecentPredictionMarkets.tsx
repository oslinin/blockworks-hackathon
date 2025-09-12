import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import PredictionMarketBox from "./PredictionMarketBox"
import Link from "next/link"

// Define types for your GraphQL response
interface PredictionMarketItem {
    marketAddress: string
    question: string
}

interface PredictionMarketQueryResponse {
    data: {
        allPredictionMarketFactoryFixedModelMarketCreatedFixedModels: {
            nodes: PredictionMarketItem[]
        }
    }
}

// Type for the extracted prediction market data
interface PredictionMarketData {
    marketAddress: string
    question: string
}

// GraphQL query as a string
const GET_RECENT_PREDICTION_MARKETS = `
  query GetRecentPredictionMarkets {
    allPredictionMarketFactoryFixedModelMarketCreatedFixedModels(
      first: 10,
      orderBy: [BLOCK_NUMBER_DESC, TX_INDEX_DESC, LOG_INDEX_DESC]
    ) {
      nodes {
        marketAddress
        question
      }
    }
  }
`

// Function to fetch data from GraphQL API
async function fetchPredictionMarkets(): Promise<PredictionMarketQueryResponse> {
    const response = await fetch("/api/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: GET_RECENT_PREDICTION_MARKETS,
        }),
    })

    if (!response.ok) {
        throw new Error("Network response was not ok")
    }

    return response.json()
}

// Custom hook for fetching and processing prediction market data
function useRecentPredictionMarkets() {
    const { data, isLoading, error } = useQuery<PredictionMarketQueryResponse>({
        queryKey: ["recentPredictionMarkets"],
        queryFn: fetchPredictionMarkets,
    })

    // Use useMemo to avoid reprocessing data when it hasn't changed
    const predictionMarketDataList = useMemo(() => {
        if (!data) return []

        // Extract the specific data we need
        return data.data.allPredictionMarketFactoryFixedModelMarketCreatedFixedModels.nodes.map(
            market => ({
                marketAddress: market.marketAddress,
                question: market.question,
            })
        )
    }, [data])

    return { isLoading, error, predictionMarketDataList }
}

// Main component that uses the custom hook
export default function RecentPredictionMarkets() {
    const { isLoading, error, predictionMarketDataList } = useRecentPredictionMarkets()

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Recent Prediction Markets</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {predictionMarketDataList.map(market => (
                    <Link
                        key={market.marketAddress}
                        href={`/`}
                        className="block transform transition hover:scale-105"
                    >
                        <PredictionMarketBox
                            key={market.marketAddress}
                            marketAddress={market.marketAddress}
                            question={market.question}
                        />
                    </Link>
                ))}
            </div>

            {predictionMarketDataList.length === 0 && (
                <p className="text-center text-gray-500 my-12">
                    No prediction markets currently created
                </p>
            )}
        </div>
    )
}

// If you want to export the hook for use in other components
export { useRecentPredictionMarkets }