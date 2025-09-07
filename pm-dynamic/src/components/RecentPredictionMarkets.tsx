import { useQuery } from "@tanstack/react-query"
import PredictionMarketBox from "./PredictionMarketBox"

// Define types for your GraphQL response
interface MarketCreatedEvent {
    marketAddress: string
    question: string
}

interface MarketQueryResponse {
    data: {
        allPredictionmarketfactoryfixedmodelPredictionmarketfactoryfixedmodelMarketcreatedfixedmodels: {
            nodes: MarketCreatedEvent[]
        }
    }
}

// GraphQL query to get the created markets
const GET_RECENT_MARKETS = `
  query GetRecentMarkets {
    allPredictionmarketfactoryfixedmodelPredictionmarketfactoryfixedmodelMarketcreatedfixedmodels(
      first: 100,
      orderBy: [BLOCK_NUMBER_DESC]
    ) {
      nodes {
        marketAddress
        question
      }
    }
  }
`

// Function to fetch data from the GraphQL API
async function fetchMarkets(): Promise<MarketQueryResponse> {
    const response = await fetch("/api/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: GET_RECENT_MARKETS,
        }),
    })

    if (!response.ok) {
        throw new Error("Network response was not ok")
    }

    return response.json()
}

export default function RecentPredictionMarkets() {
    const {
        data: marketData,
        isLoading,
        error,
    } = useQuery<MarketQueryResponse>({
        queryKey: ["recentMarkets"],
        queryFn: fetchMarkets,
    })

    const markets = marketData?.data?.allPredictionmarketfactoryfixedmodelPredictionmarketfactoryfixedmodelMarketcreatedfixedmodels.nodes || []

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Recently Created Prediction Markets</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {markets.map(market => (
                    <PredictionMarketBox
                        key={market.marketAddress}
                        marketAddress={market.marketAddress}
                        question={market.question}
                    />
                ))}
            </div>

            {markets.length === 0 && (
                <p className="text-center text-gray-500 my-12">
                    No prediction markets have been created yet.
                </p>
            )}
        </div>
    )
}