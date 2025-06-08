"use client";
import { Chart } from "react-google-charts";

export const data = [
  ["Company", "Parent", "Layoffs"],
  ["All", null, 0],
  ["Meta", "All", 11000],
  ["Amazon", "All", 18000],
  ["Microsoft", "All", 10000],
  ["Google", "All", 12000],
  ["Apple", "All", 8000],
];
export const options = {
  minColor: "#f00",
  midColor: "#ddd",
  maxColor: "#0d0",
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
