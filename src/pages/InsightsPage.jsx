"use client";
import React, { useEffect, useState } from "react";
import ListNews from "../components/ListNews";
import SentimentLiquidity from "../components/SentimentLiquidity";

function InsightsPage() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ticker, setTicker] = useState("");
  // const topNews = [
  //   {
  //     headline: "Is it accessible?",
  //     impact: "Positive",
  //     liquidity: "10%",
  //     company: "Tailwind CSS",
  //     summary:
  //       "Tailwind CSS is a utility-first CSS framework that can be used to build responsive and modern user interfaces. However, it may not be suitable for all projects, especially those that require a more traditional approach to styling.",
  //   },
  //   {
  //     headline: "Can I use Tailwind CSS?",
  //     impact: "Negative",
  //     liquidity: "-5%",
  //     company: "Tailwind CSS",
  //     summary:
  //       "Tailwind CSS is a utility-first CSS framework that can be used to build responsive and modern user interfaces. However, it may not be suitable for all projects, especially those that require a more traditional approach to styling.",
  //   },
  //   {
  //     headline: "Is this dynamic?",
  //     impact: "Positive",
  //     liquidity: "10%",
  //     company: "Tailwind CSS",
  //     summary:
  //       "As tech's megacap companies enter first-quarter earnings season, uncertainty reigns supreme due to President Trump's on-again, off-again approach to tariffs, which has created market chaos, with companies like Tesla, Alphabet, Meta, Microsoft, Amazon, Apple, and Nvidia facing forward-looking questions that may be difficult to answer.",
  //   },
  // ];

  useEffect(() => {
    if (!ticker) {
      setInsights([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/fetch-data?collection=insights&ticker=${ticker}`)
      .then((res) => res.json())
      .then((response) => {
        console.log(response.data);
        setInsights(response.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [ticker]);

  const handleTickerChange = (e) => {
    const selectedTicker = e.target.value.toLowerCase();
    setTicker(selectedTicker);
  };

  return (
    <div className="flex gap-6 h-full w-full">
      <div className="flex-1 mt-[-40px] flex flex-col justify-start h-full w-full p-4">
        <select
          className="w-[250px] text-sm text-semibold m-10 ml-0 p-2 border rounded-md"
          onChange={handleTickerChange}
          value={ticker}
        >
          <option value="">Select Company</option>
          <option value="meta">Meta</option>
          <option value="google">Google</option>
          <option value="microsoft">Microsoft</option>
          <option value="apple">Apple</option>
          <option value="amazon">Amazon</option>
        </select>
        <h1 className="text-xl font-bold mb-4">Insights</h1>
        <div className="flex flex-col gap-4 mb-8">
          <SentimentLiquidity data={insights} />
        </div>
      </div>
     {ticker ? (
      loading ? (
        <div className="flex pt-10 flex-col gap-2 w-full">
          <p>Loading...</p>
        </div>
      ) : (
        <ListNews newsItems={insights} heading="Filtered News" />
      )
     )
     :(
      <div className="flex pt-10 flex-col gap-2 w-full">
        <p>Please select a company to view the data</p>
      </div>
     )}
    </div>
  );
}

export default InsightsPage;

// ticker
// "meta"
// title
// "Meta needs to win over AI developers at its first LlamaCon ..."
// url
// "https://techcrunch.com/2025/04/29/meta-needs-to-win-over-ai-developers…"
// summary
// "Meta is set to host its first LlamaCon AI developer conference, where …"
// date
// "2025-04-29"
// sentiment
// -0.9972723126411438
// critical_events
// Array (empty)
