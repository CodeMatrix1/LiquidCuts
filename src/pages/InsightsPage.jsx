import React from "react";
import ListNews from "@/components/ListNews";
import MarketTrendsBox from "@/components/MarketTrends";

function InsightsPage() {
  const topNews = [
    {
      headline: "Is it accessible?",
      impact: "Positive",
      liquidity: "10%",
      company: "Tailwind CSS",
      summary:
        "Tailwind CSS is a utility-first CSS framework that can be used to build responsive and modern user interfaces. However, it may not be suitable for all projects, especially those that require a more traditional approach to styling.",
    },
    {
      headline: "Can I use Tailwind CSS?",
      impact: "Negative",
      liquidity: "-5%",
      company: "Tailwind CSS",
      summary:
        "Tailwind CSS is a utility-first CSS framework that can be used to build responsive and modern user interfaces. However, it may not be suitable for all projects, especially those that require a more traditional approach to styling.",
    },
    {
      headline: "Is this dynamic?",
      impact: "Positive",
      liquidity: "10%",
      company: "Tailwind CSS",
      summary:
        "Tailwind CSS is a utility-first CSS framework that can be used to build responsive and modern user interfaces. However, it may not be suitable for all projects, especially those that require a more traditional approach to styling.",
    },
  ];
  return (
    <div className="flex gap-6 h-full w-full">
      <div className="flex-1 flex flex-col justify-start h-full w-full overflow-y-auto p-4">
        <select className="w-[250px] m-10 ml-6 p-2 border rounded-md">
          <option value="">Select Company</option>
          <option value="meta">Meta</option>
          <option value="google">Google</option>
          <option value="microsoft">Microsoft</option>
          <option value="apple">Apple</option>
          <option value="amazon">Amazon</option>
        </select>
        <h1 className="text-2xl font-bold mb-4">Insights</h1>
        <MarketTrendsBox />
      </div>
      <ListNews
        newsItems={topNews}
        heading="Top News"
        subheading="Stay tuned for the latest updates!"
      />
    </div>
  );
}

export default InsightsPage;
