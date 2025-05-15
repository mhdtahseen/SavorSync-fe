import { ActiveOrders } from "../../pages/Home/Billing/Tabs/ActiveOrders";
import { CompletedOrders } from "../../pages/Home/Billing/Tabs/CompletedOrders";
import { TabInputData } from "../Interfaces";

export const RBAC_Tabs = {
  Captain: <TabInputData[]>[
    { label: "Active Orders", value: "activeOrders", component: ActiveOrders },
    {
      label: "Completed Orders",
      value: "completedOrders",
      component: CompletedOrders,
    },
  ],
  Owner: <TabInputData[]>[
    { label: "Payment Dashboard", value: "payment" },
    { label: "Active Orders", value: "activeOrders", component: ActiveOrders },
    {
      label: "Completed Orders",
      value: "completedOrders",
      component: CompletedOrders,
    },
  ],
};

export const PAYMENT_METHODS = ["Cash", "UPI"];
