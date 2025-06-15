"use client"
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

// Example data: X-axis is months, Y-axis is layoff count



const options = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    tooltip: { enabled: true },
  },
  scales: {
    y: { beginAtZero: true },
    x: {
      ticks: {
        callback: function(value, index, ticks) {
          // Show year only for the first month of each year
          const label = this.getLabelForValue(value);
          const [year, month] = label.split('-');
          if (month === '01') return year;
          return '';
        },
        offset: true
      }
    }
  },
};

export default function LayoffLineChart() {
  const [allData, setAllData] = useState({});
  // Assume allData is an object: { meta: [...], microsoft: [...], ... }
  // date is in "YYYY-MM-DD" or similar format

  // 1. Get all unique months across all companies
  const allMonths = Array.from(
    new Set(
      Object.values(allData)
        .flat()
        .map(item => item.date && item.date.slice(0, 7))
    )
  ).filter(Boolean).sort();

  // 2. Get all tickers (companies)
  const tickers = Object.keys(allData).filter(
    key => !key.startsWith('_')
  );

  const colorMap = {
    microsoft: 'rgb(54, 162, 235)',
    meta: 'rgb(255, 99, 132)',
    google: 'rgb(255, 206, 86)',
    amazon: 'rgb(75, 192, 192)',
    apple: 'rgb(153, 102, 255)'
  };

  // 3. Build datasets for each company
  const datasets = tickers.map(ticker => {
    const articles = Array.isArray(allData[ticker]) ? allData[ticker] : [];
    const data = allMonths.map(month => {
      const sum = articles
        .filter(item => item.date && item.date.startsWith(month))
        .reduce((acc, item) => {
          if (typeof item.layoffs === 'string') {
            const match = item.layoffs.replace(/,/g, '').match(/\d+/);
            return acc + (match ? parseInt(match[0], 10) : 0);
          }
          return acc;
        }, 0);
      // If sum is 0, return null so Chart.js skips this point
      return sum === 0 ? null : sum;
    });
    return {
      label: ticker.charAt(0).toUpperCase() + ticker.slice(1),
      data: [null,...data],
      showLine: false,
      borderColor: colorMap[ticker.toLowerCase()] || 'gray',
      backgroundColor: colorMap[ticker.toLowerCase()] || 'gray',
      pointRadius: 5,
      fill: false,
      tension: 0.2,
    };
  });

  // 4. Use allMonths as your labels and datasets as your data
  const paddedLabels = ['', ...allMonths, ''];

  const lineData = {
    labels: paddedLabels,
    datasets
  };

  useEffect(() => {
    fetch('/api/fetch-data?collection=layoffs')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setAllData(data);
      });
  }, []);

  return (
    <div style={{ width: '100%', width:500, margin: '0 auto' }}>
      <h2>Layoffs Over Time</h2>
      <Line data={lineData} options={options} width={700} height={300} />
    </div>
  );
}

