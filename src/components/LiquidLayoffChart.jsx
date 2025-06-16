"use client"
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: { font: { size: 10 } },
    },
    tooltip: { enabled: true },
  },
  scales: {
    x: {
      ticks: {
        maxRotation: 25,
        minRotation: 15,
        font: { size: 10 },
      },
    },
    y1: {
      type: "linear",
      position: "left",
      title: { display: true, text: "Liquidity Change" },
      beginAtZero: true,
      ticks: { font: { size: 10 } },
    },
    y2: {
      type: "linear",
      position: "right",
      title: { display: true, text: "Layoff Count" },
      beginAtZero: true,
      grid: { drawOnChartArea: false },
      ticks: { font: { size: 10 } },
    },
  },
};

export default function LiquidityLayoffLineChart({ ticker }) {
  const [layoffData, setLayoffData] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/fetch-data?collection=layoffs&ticker=${ticker}`).then(res => res.json()),
      fetch(`/api/fetch-data?collection=stockdata&ticker=${ticker}`).then(res => res.json())
    ])
      .then(([layoffRes, stockRes]) => {
        setLayoffData(layoffRes[ticker] || []);
        setStockData(stockRes[ticker] || []);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [ticker]);

  if (loading) return <div>Loading...</div>;
  if (!layoffData || !stockData) return <div>No data found.</div>;

  // Only include months where there is at least one layoff
  const allMonths = Array.from(
    new Set(
      layoffData
        .filter(item => {
          if (typeof item.layoffs === 'string') {
            const match = item.layoffs.replace(/,/g, '').match(/\d+/);
            return match && parseInt(match[0], 10) > 0;
          }
          return false;
        })
        .map(item => item.date && item.date.slice(0, 7))
    )
  ).filter(Boolean).sort();

  // Layoff count per month
  const layoffCounts = allMonths.map(month => {
    return layoffData
      .filter(item => item.date && item.date.startsWith(month))
      .reduce((acc, item) => {
        if (typeof item.layoffs === 'string') {
          const match = item.layoffs.replace(/,/g, '').match(/\d+/);
          return acc + (match ? parseInt(match[0], 10) : 0);
        }
        return acc;
      }, 0);
  });

  // Liquidity change per month (only if layoff exists)
  const liquidityChanges = allMonths.map(month => {
    const layoffSum = layoffCounts[allMonths.indexOf(month)];
    if (layoffSum > 0) {
      const stock = stockData.find(item => item.date && item.date.startsWith(month));
      return stock ? stock.Avg_Spread : null;
    }
    return null;
  });

  const chartData = {
    labels: allMonths,
    datasets: [
      {
        type: 'line',
        label: 'Liquidity Change (Avg Spread)',
        data: liquidityChanges,
        yAxisID: 'y1',
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.15)',
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: true,
        borderWidth: 2,
      },
      {
        type: 'line',
        label: 'Layoff Count',
        data: layoffCounts,
        yAxisID: 'y2',
        borderColor: 'orange',
        backgroundColor: 'rgba(255, 165, 0, 0.1)',
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 4,
        fill: false,
        borderWidth: 2,
        borderDash: [6, 4],
      }
    ]
  };

  {loading && <div>Loading...</div>}
  {!layoffData && !stockData && <div>No data found.</div>}

  return (
    <div style={{ maxWidth: 500, height: 220, margin: "12px auto", padding: 0 }}>
      <h2 style={{ textAlign: "center", marginBottom: 8, fontSize: 15 }}>Liquidity Change & Layoff Count Over Time</h2>
      <div style={{ height: 160 }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
