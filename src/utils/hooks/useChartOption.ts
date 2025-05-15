// import { chartTypeTemplates } from "../configs/chartConfig";

export function useChartOption({
  type,
  title,
  subtext,
  data,
  xAxisData,
  seriesName,
  orientation = "vertical", // "horizontal" or "vertical"
}) {
  if (!type) return {};

  const isPie = type === "pie";
  const isBar = type === "bar";
  const isLine = type === "line";

  const baseConfig: any = {
    // title: {
    //   text: title,
    //   subtext,
    //   left: "center",
    // },
    tooltip: {
      trigger: isPie ? "item" : "axis",
      formatter: isPie ? "{b}: {c} ({d}%)" : undefined,
      axisPointer: !isPie
        ? {
            type: "shadow",
          }
        : undefined,
    },
    legend: !isPie
      ? {
          top: "5%",
          left: "right",
        }
      : {
          type: "scroll",
          orient: "horizontal",
          bottom: "10%",
          align: "auto",
          itemGap: 10,
          padding: [20, 0, 0, 0],
        },
    ...((isBar || isLine) && {
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
    }),
    xAxis: isPie
      ? undefined
      : orientation === "horizontal"
      ? { type: "value" }
      : { type: "category", data: xAxisData },
    yAxis: isPie
      ? undefined
      : orientation === "horizontal"
      ? { type: "category", data: xAxisData }
      : { type: "value" },
    series: [
      {
        name: title,
        type,
        data: isPie
          ? data.map((item) => ({
              value: item.value,
              name: item.label,
            }))
          : data.map((item) => item.value),
        radius: isPie ? "50%" : undefined,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  if (isBar && orientation === "horizontal") {
    baseConfig.xAxis = { type: "value" };
    baseConfig.yAxis = { type: "category", data: xAxisData };
  }

  return baseConfig;
}
