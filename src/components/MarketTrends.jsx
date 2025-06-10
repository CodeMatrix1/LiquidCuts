import React from "react";

const trends = [
  {
    title: "Postitive Outlook: potential payoff",
    desc: "This event may require immediate attention",
    impact: 140,
  },
  {
    title: "Actually impacting liquidity",
    desc: "This event may require immediate attention",
    impact: 14,
  },
  {
    title: "Critical Event: layoffs",
    desc: "This event may require immediate attention",
    impact: 1,
  },
  {
    title: "Critical Event: legal issues",
    desc: "This event may require immediate attention",
    impact: 1,
  },
  {
    title: "Critical Event: leadership changes",
    desc: "This event may require immediate attention",
    impact: 1,
  },
  {
    title: "Critical Event: supply side issues",
    desc: "This event may require immediate attention",
    impact: 1,
  },
];

export default function MarketTrendsBox() {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8 w-[500px]">
      <div className="mb-4">
        <div className="font-bold text-lg">Key Market Trends</div>
      </div>
      {trends.map((trend, idx) => (
        <div key={idx} className="mb-4 flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm"> {trend.title} </div>
            <div className="text-gray-500 text-sm">{trend.desc}</div>
          </div>
          <div className="text-gray-800 font-mono text-sm flex items-center">
            {trend.impact} {trend.impact === 1 ? "article" : " articles"}
          </div>
        </div>
      ))}
    </div>
  );
}
