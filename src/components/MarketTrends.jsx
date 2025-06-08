import React from "react";

const trends = [
  {
    title: "Critical Event: lawsuit",
    desc: "This event may require immediate attention",
    impact: -1,
  },
  {
    title: "Critical Event: recall",
    desc: "This event may require immediate attention",
    impact: -1,
  },
  {
    title: "Critical Event: layoffs",
    desc: "This event may require immediate attention",
    impact: -1,
  },
];

export default function MarketTrendsBox() {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8 max-w-3xl">
      <div className="mb-4">
        <div className="font-bold text-lg">Key Market Trends</div>
        <div className="text-gray-500 text-sm mb-2">
          Significant trends affecting Mercedes Benz
        </div>
      </div>
      {trends.map((trend, idx) => (
        <div key={idx} className="mb-4 flex items-center justify-between">
          <div>
            <div className="font-semibold"> {trend.title} </div>
            <div className="text-gray-500 text-sm">{trend.desc}</div>
          </div>
          <div className="text-rose-500 font-mono text-lg flex items-center">
            ↘ -1
          </div>
        </div>
      ))}
    </div>
  );
}
