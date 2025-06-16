import React from "react";

export default function SentimentLiquidity({ data }) {
  let averageSentiment = 0;
  let liquidity = 0;
  let validLiquidityEntries = 0; // Track valid liquidity entries
  let regular_events = {
    "Positive Outlook: potential payoff": 0,
    "Actually impacting liquidity": 0,
  };
  let critical_events = {};

  // 1. Fixed critical_events counting
  for (let i = 0; i < data.length; i++) {
    averageSentiment += data[i].sentiment;

    // 2. Fixed liquidity calculation
    if (data[i].liquidity !== undefined) {
      liquidity += data[i].liquidity;
      validLiquidityEntries++;
    }

    // 3. Fixed critical events handling
    if (data[i].labels?.length) {
      data[i].labels.forEach((event) => {
        critical_events[event] = (critical_events[event] || 0) + 1;
      });
    } else {
      // Only count regular events if there are NO critical events
      if (data[i].sentiment > 0) {
        regular_events["Positive Outlook: potential payoff"] += 1;
      }
      if (Math.abs(data[i].liquidity || 0) > 10) {
        regular_events["Actually impacting liquidity"] += 1;
      }
    }
  }

  // 4. Fixed calculations
  averageSentiment = data.length ? averageSentiment / data.length : 0;
  const sentimentPercent = Math.min(Math.max(averageSentiment * 100, 0), 100);

  liquidity = validLiquidityEntries ? liquidity / validLiquidityEntries : 0;

  return (
    <div className="flex flex-col gap-8">
      {/* Sentiment & Liquidity Cards */}
      <div className="flex gap-4 w-[500px]">
        <div className="flex flex-col gap-4 bg-white rounded-xl w-[500px] shadow p-4">
          {/* Fixed Sentiment Progress Bar */}
          <div>
            <div className="font-semibold text-sm mb-1">Sentiment</div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>{averageSentiment < 0 ? "Negative" : "0"}</span>
              <span>{averageSentiment < 0 ? "0" : "Positive"}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-black rounded transition-all duration-300"
                style={{
                  width: `${Math.abs(averageSentiment) * 100}%`,
                  marginLeft: `${averageSentiment > 0 ? 0 : 100 - Math.abs(averageSentiment) * 100}%`
                }}
              />
            </div>
            <div className="text-xs text-center text-gray-600 mt-1">
              Average Sentiment: {averageSentiment.toFixed(2)}
            </div>
          </div>

          {/* Fixed Liquidity Progress Bar */}
          <div>
            <div className="font-semibold text-sm mb-1">Liquidity Impact</div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>{liquidity > 0 ? "0" : "-100"}%</span>
              <span>{liquidity > 0 ? "100" : "0"}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
              <div
                className="h-2 bg-black rounded transition-all duration-300"
                style={{
                  width: `${Math.abs(liquidity)}%`,
                  marginLeft: `${
                    liquidity > 0 ? 0 : 100 - Math.abs(liquidity)
                  }%`,
                }}
              />
            </div>
            <div className="text-xs text-center text-gray-600 mt-1">
              Average Impact: {liquidity.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="bg-white rounded-xl shadow p-6 mb-8 w-[500px]">
        <div className="mb-4">
          <div className="font-bold text-lg">Key Market Trends</div>
        </div>

        {/* Regular Events */}
        {Object.entries(regular_events).map(([trend, count]) => (
          <div key={trend} className="mb-4 flex items-center justify-between">
            <div className="font-semibold text-sm">{trend}</div>
            <div className="text-gray-800 font-mono text-sm">
              {count} {count === 1 ? "article" : "articles"}
            </div>
          </div>
        ))}

        {/* Critical Events - now shows properly */}
        {Object.entries(critical_events).map(([event, count]) => (
          <div key={event} className="mb-4 flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm text-red-600">
                Critical Event: {event}
              </div>
              <div className="text-gray-500 text-sm">
                Requires immediate attention
              </div>
            </div>
            <div className="text-red-600 font-mono text-sm">
              {count} {count === 1 ? "article" : "articles"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
