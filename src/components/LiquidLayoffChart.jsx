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
  plugins: {
    legend: { position: "top" },
    tooltip: { enabled: true },
  },
  scales: {
    y1: {
      type: "linear",
      position: "left",
      title: { display: true, text: "Liquidity Change (%)" },
      beginAtZero: true,
    },
    y2: {
      type: "linear",
      position: "right",
      title: { display: true, text: "Layoff Count" },
      beginAtZero: true,
      grid: { drawOnChartArea: false }, // Only want the grid lines for one axis
    },
  },
};

export default function LiquidityLayoffLineChart({ data }) {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h2>Liquidity Change & Layoff Count Over Time</h2>
      <Line data={data} options={options} />
    </div>
  );
}
