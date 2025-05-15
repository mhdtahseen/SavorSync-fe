// chartConfigs.js
export const chartOptions = {
  paymentMethod: {
    title: "Payments by Method",
    types: {
      pie: {
        title: {
          text: "Payments by Method",
          subtext: "Sample data",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}:{c}%",
        },
        series: [
          {
            name: "Payment Method",
            type: "pie",
            radius: "50%",
            data: [
              { value: 100, name: "Cash" },
              { value: 50, name: "UPI" },
              { value: 30, name: "Card" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
      bar: {
        title: {
          text: "Payments by Method",
          subtext: "Sample data",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          type: "category",
          data: ["Cash", "UPI", "Card"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "Payments",
            type: "bar",
            data: [100, 50, 30],
            emphasis: {
              focus: "series",
            },
          },
        ],
      },
      line: {
        title: {
          text: "Payments by Method (Line)",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: ["Cash", "UPI", "Card"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "Payments",
            type: "line",
            data: [100, 50, 30],
            smooth: true,
            lineStyle: {
              color: "#00c1d4",
            },
          },
        ],
      },
    },
  },

  revenueTrend: {
    title: "Revenue Over Time",
    types: {
      line: {
        title: {
          text: "Revenue Over Time",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: ["2025-04-28", "2025-04-29", "2025-04-30", "2025-05-01"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "Revenue",
            type: "line",
            data: [200, 300, 250, 400],
          },
        ],
      },
      bar: {
        title: {
          text: "Revenue Over Time",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: ["2025-04-28", "2025-04-29", "2025-04-30", "2025-05-01"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "Revenue",
            type: "bar",
            data: [200, 300, 250, 400],
          },
        ],
      },
    },
  },

  ordersByTable: {
    title: "Orders by Table",
    types: {
      pie: {
        title: {
          text: "Orders by Table",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)",
        },
        series: [
          {
            name: "Table Orders",
            type: "pie",
            radius: "50%",
            data: [
              { value: 60, name: "Table 1" },
              { value: 90, name: "Table 2" },
              { value: 120, name: "Table 3" },
            ],
          },
        ],
      },
      bar: {
        title: {
          text: "Orders by Table",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          type: "category",
          data: ["Table 1", "Table 2", "Table 3"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "Orders",
            type: "bar",
            data: [60, 90, 120],
            emphasis: {
              focus: "series",
            },
          },
        ],
      },
      scatter: {
        title: {
          text: "Orders by Table (Scatter)",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: ["Table 1", "Table 2", "Table 3"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "Orders",
            type: "scatter",
            data: [
              [0, 60],
              [1, 90],
              [2, 120],
            ],
            symbolSize: 20,
          },
        ],
      },
    },
  },

  totalRevenue: {
    title: "Total Revenue",
    types: {
      gauge: {
        title: {
          text: "Total Revenue",
          left: "center",
        },
        series: [
          {
            name: "Revenue",
            type: "gauge",
            detail: {
              formatter: "{value} ₹",
            },
            data: [
              {
                value: 5000,
                name: "Total Revenue",
              },
            ],
          },
        ],
      },
    },
  },
};
