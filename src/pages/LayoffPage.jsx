"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ListNews from "@/components/ListNews";
import LayoffBarChart from "@/components/LayoffBarChart";
import LiquidityLayoffLineChart from "@/components/LiquidLayoffChart";

// Dynamically import the chart with SSR disabled
const MyLineChart = dynamic(() => import("@/components/LineChart"), {
  ssr: false,
});

export default function LayoffPage() {
  const [companyNews, setCompanyNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticker, setTicker] = useState("");
  const barData = {
    labels: ["Microsoft", "Meta", "Google", "Amazon", "Apple"],
    datasets: [
      {
        label: "Layoffs in 2025 (so far)",
        data: [6500, 3600, 1000, 200, 0], // Google and Amazon are estimates for 2025
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Microsoft",
        data: [1200, 1500, 800, 2000, 1800, 900],
        fill: false,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.2,
        pointRadius: 5,
      },
      {
        label: "Meta",
        data: [1000, 1100, 900, 1300, 1200, 700],
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.2,
        pointRadius: 5,
      },
    ],
  };
  const liqlayoffData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Liquidity Change (%)",
        data: [5, 8, -2, 10, 3, -4, 7],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        yAxisID: "y1",
        tension: 0.3,
        pointRadius: 5,
        fill: false,
      },
      {
        label: "Layoff Count",
        data: [0, 0, 1200, 0, 800, 0, 1500],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        yAxisID: "y2",
        tension: 0.3,
        pointRadius: 5,
        fill: false,
        type: "line",
      },
    ],
  };
  // const companyNews = [
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
  //       "Tailwind CSS is a utility-first CSS framework that can be used to build responsive and modern user interfaces. However, it may not be suitable for all projects, especially those that require a more traditional approach to styling.",
  //   },
  // ];
  useEffect(() => {
    fetch("/api/fetch-data?collection=layoffs")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCompanyNews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleTickerChange = (e) => {
    const selectedTicker = e.target.value.toLowerCase();
    setTicker(selectedTicker);
  };

  if (loading) return <div>Loading...</div>;
  if (!companyNews) return <div>No data found.</div>;
  return (
    <div className="flex flex-row w-full pt-6">
      <div className="flex flex-col gap-14 h-full w-full">
        <LayoffBarChart data={barData} />
        <MyLineChart data={lineData} />
      </div>
      <div className="flex flex-col items-start mt-[-40px] h-full w-full">
        <div className="flex flex-col gap-2 w-full">
          <select
            className="w-[250px] m-10 ml-6 p-2 border rounded-md"
            value={ticker}
            onChange={handleTickerChange}
          >
            <option value="">Select Company</option>
            <option value="meta">Meta</option>
            <option value="google">Google</option>
            <option value="microsoft">Microsoft</option>
            <option value="apple">Apple</option>
            <option value="amazon">Amazon</option>
          </select>
          <LiquidityLayoffLineChart data={liqlayoffData} />
          <ListNews
            newsItems={companyNews[ticker] || []}
            subheading={"Fetched Layoff news"}
          />
        </div>
      </div>
    </div>
  );
}
