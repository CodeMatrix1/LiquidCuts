import React from "react";

export default function SentimentLiquidity({
  sentiment = 1, // 1 = 100% positive, 0 = 0% positive
  liquidity = 0.0385, // 0.0385 = 3.85%
}) {
  return (
    <div className="flex gap-4 w-[500px]">
      {/* Sentiment Assessment */}
      <div className="flex flex-col gap-4 bg-white rounded-xl  w-[500px] shadow p-4">
        <div>
          <div className="font-semibold text-sm mb-1">Sentiment</div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Negative</span>
            <span>Positive</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-black rounded"
              style={{ width: `${sentiment * 100}%` }}
            />
          </div>
          <div className="text-xs text-center text-gray-600 mt-1">
            Current Sentiment: {(sentiment * 100).toFixed(2)}% Positive
          </div>
        </div>
        {/* Liquidity Impact */}
        <div>
          <div className="font-semibold text-sm mb-1">Liquidity Impact</div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Low</span>
            <span>High</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-black rounded"
              style={{ width: `${Math.min(liquidity * 100, 100)}%` }}
            />
          </div>
          <div className="text-xs text-center text-gray-600 mt-1">
            Positive Liquidity Impact: {(liquidity * 100).toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
}
