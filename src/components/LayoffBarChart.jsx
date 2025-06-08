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

export default function LayoffBarChart({ data }) {
  return (
    <div style={{ width: 500, margin: "0 auto" }}>
      <h2>Tech Layoffs (so far)</h2>
      <Bar
        data={data}
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
