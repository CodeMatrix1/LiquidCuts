import React from 'react';
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
  },
};

export default function LayoffLineChart({ data }) {
  return (
    <div style={{ width: '100%', width:500, margin: '0 auto' }}>
      <h2>Layoffs Over Time</h2>
      <Line data={data} options={options} width={700} height={300} />
    </div>
  );
}

