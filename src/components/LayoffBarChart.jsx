"use client"
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function LayoffBarChart() {
  const [barData, setBarData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fetch-data?collection=layoffs")
      .then((res) => res.json())
      .then((data) => {
        console.log("Raw layoffs data:", data);
        
        // Generate bar chart data from MongoDB data
        const companies = ["microsoft", "meta", "google", "amazon", "apple"];
        console.log("Processing companies:", companies);
        
        const layoffData = companies.map(company => {
          const companyData = data[company] || [];
          // Sum up all layoffs for the company
          const totalLayoffs = companyData.reduce((sum, item) => {
            let layoffCount = 0;
            if (typeof item.layoffs === 'string') {
              // Extract the first group of digits (optionally with commas)
              const match = item.layoffs.replace(/,/g, '').match(/\d+/);
              if (match) {
                layoffCount = parseInt(match[0], 10);
              }
            }
            return sum + layoffCount;
          }, 0);
          console.log(`Total layoffs for ${company}:`, totalLayoffs);
          return totalLayoffs;
        });

        console.log("Final layoff data array:", layoffData);

        const newBarData = {
          labels: ["Microsoft", "Meta", "Google", "Amazon", "Apple"],
          datasets: [
            {
              label: "Layoffs in 2025 (so far)",
              data: layoffData,
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
        console.log("Bar data:", newBarData);
        setBarData(newBarData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!barData) return <div>No chart data available.</div>;


  return (
    <div style={{ width: 500, margin: "0 auto" }}>
      <h2>Tech Layoffs (so far)</h2>
      <Bar
        data={barData}
        width={700}
        height={300}
        options={{
          indexAxis: "y",
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
          },
          scales: {
            x: {
              beginAtZero: true,
              title: { display: true, text: "Number of Layoffs" },
            },
          },
        }}
      />
    </div>
  );
}
