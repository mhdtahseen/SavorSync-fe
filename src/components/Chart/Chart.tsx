// components/Chart/Chart.jsx
import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import { MTSelect } from "../select/MTSelect";
import { useChartOption } from "../../utils/hooks/useChartOption";

const ChartCard = ({ title, chartTypes, chartData }) => {
  const rand = Math.floor(Math.random() * 3);
  const [selectedChart, setSelectedChart] = useState(
    // Object.keys(chartTypes)[0]
    chartTypes[rand]
  );

  const handleChartTypeChange = (e) => {
    setSelectedChart(e.toLowerCase());
  };

  const orientation = "vertical";
  //   const type = selectedChart;

  const option = useChartOption({
    type: selectedChart,
    title,
    subtext: "Subtext",
    data: chartData,
    xAxisData: chartData.map((item) => item.label),
    seriesName: "Something",
    orientation,
  });

  return (
    <div className="chart-card flex flex-col h-full w-full p-3 border rounded shadow-sm overflow-hidden">
      <h2 className="text-lg font-semibold chart-drag-handle cursor-move mb-2">
        {title}
      </h2>
      <MTSelect
        label="Chart Type"
        handleChange={handleChartTypeChange}
        options={chartTypes.map(
          (type) => type.charAt(0).toUpperCase() + type.slice(1)
        )}
      />
      <div className="flex-1 min-h- mt-2">
        <ReactECharts
          option={option}
          notMerge={true}
          style={{ height: "100%", width: "100%" }}
          // opts={{ renderer: "svg" }}
        />
      </div>
    </div>
  );
};

export default ChartCard;
