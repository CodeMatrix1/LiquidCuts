"use client";
import { Chart } from "react-google-charts";

export const data = [
  ["Company", "Parent", "Layoffs"],
  ["All", null, 10.11],
  ["Meta(1.6 T)", "All", 1.6],
  ["Amazon(2.15 T)", "All", 2.15],
  ["Microsoft(3.38 T)", "All", 3.38],
  ["Google(2.08 T)", "All", 2.08],
  ["Apple(3 T)", "All", 3],
];
export const options = {
  minColor: "#1976d2",
  midColor: "#fff176",
  maxColor: "#d32f2f",
  headerHeight: 15,
  fontColor: "black",
  showScale: true,
};

export default function LayoffTreemap() {
  return (
    <Chart
      chartType="TreeMap"
      height="600px" // Change height here
      width="500px" // Change width here
      data={data}
      options={options}
    />
  );
}
