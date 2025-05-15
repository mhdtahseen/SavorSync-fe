import React, { useEffect, useState } from "react";
import GridLayout from "react-grid-layout";
import ChartCard from "../../../components/Chart/Chart";
import useApiRequest from "../../../utils/hooks/useApi";
import { analytics } from "../../../utils/endpoints";
import { useSelector } from "react-redux";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
// import { chartOptions } from "../../../utils/configs/chartConfigs";

export const LandingPage = () => {
  const chartTypes = ["pie", "bar", "line"];

  const chartConfigs = [
    { title: "Revenue Per Day", key: "revenue" },
    { title: "Top Items", key: "items" },
    { title: "Payment Summary", key: "payment" },
    { title: "Orders Per Day", key: "orders" },
    { title: "Tablewise Revenue", key: "tableRevenue" },
  ];

  const [apiData, setAPIData] = useState({
    revenue: [],
    items: [],
    payment: [],
    orders: [],
    tableRevenue: [],
  });

  const user = useSelector((state: any) => state.user);
  const { apiRequest } = useApiRequest();

  const layout = [
    { i: "revenue", x: 0, y: 0, w: 6, h: 3 },
    { i: "items", x: 6, y: 0, w: 6, h: 3 },
    { i: "payment", x: 0, y: 3, w: 4, h: 3 },
    { i: "orders", x: 4, y: 3, w: 4, h: 3 },
    { i: "tableRevenue", x: 8, y: 3, w: 4, h: 3 },
  ];

  const fetchData = async () => {
    try {
      const [revenue, items, payment, orders, tableRevenue] = await Promise.all(
        [
          apiRequest(
            "GET",
            `${analytics}/${user?.restaurantId}/revenue-per-day`
          ),
          apiRequest("GET", `${analytics}/${user?.restaurantId}/top-items`),
          apiRequest(
            "GET",
            `${analytics}/${user?.restaurantId}/payment-method-summary`
          ),
          apiRequest(
            "GET",
            `${analytics}/${user?.restaurantId}/orders-per-day`
          ),
          apiRequest(
            "GET",
            `${analytics}/${user?.restaurantId}/table-wise-revenue`
          ),
        ]
      );

      setAPIData({ revenue, items, payment, orders, tableRevenue });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Simulate fetching data
    fetchData();
  }, [apiRequest]);

  return (
    <div className="p-3">
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={150}
        width={1150}
        isResizable={true}
        isDraggable={true}
        draggableHandle=".chart-drag-handle"
      >
        {chartConfigs.map(({ title, key }) => (
          <div key={key}>
            <ChartCard
              title={title}
              chartTypes={chartTypes}
              chartData={apiData[key as keyof typeof apiData]}
            />
          </div>
        ))}
      </GridLayout>
    </div>
  );
};
