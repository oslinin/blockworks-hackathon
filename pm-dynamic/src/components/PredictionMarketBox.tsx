import React from "react"

interface PredictionMarketBoxProps {
    marketAddress: string
    question: string
}

export default function PredictionMarketBox({ marketAddress, question }: PredictionMarketBoxProps) {
    return (
        <div className="border rounded-lg overflow-hidden shadow-md p-4">
            <div>
                <h3 className="font-bold text-lg mb-2">{question}</h3>
                <p className="text-sm text-gray-600" title={marketAddress}>
                    {marketAddress}
                </p>
            </div>
        </div>
    )
}