import React from "react";
import { Chart } from "react-google-charts";

const CustomerRatingChart = () => {
  // Data for the chart
  const data = [
    ["Year", "Rating"],

    ["2022", 30],
    ["2023", 20],
    ["2024", 60],
    ["2025", 30],
  ];

  // Options for the chart
  const options = {
    pieHole: 0.5, // Makes it a donut chart
    legend: "none", // Removes the legend outside the chart
    pieSliceText: "label", // Displays only the year inside the slices
    backgroundColor: "transparent", // Transparent background
    slices: {
      0: { color: "#e87ddd" }, // Customize slice colors
      1: { color: "#d47e50" },
      2: { color: "#dbc558" },
      2: { color: "#ad7315" },
    },
    chartArea: {
      width: "90%",
      height: "90%",
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: "200px", margin: "auto" }}>
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width="100%"
        height="200px"
      />
    </div>
  );
};

export default CustomerRatingChart;
