import { createContext, useCallback, useState } from "react";
import { restaurantBills } from "../endpoints";
import { useSelector } from "react-redux";
import useApiRequest from "../hooks/useApi";

export const BillingContext = createContext<any | undefined>(undefined);

export const BillingProvider = ({ children }) => {
  const user = useSelector((state: any) => state.user);
  const { apiRequest } = useApiRequest();

  const [refreshOrders, setRefreshOrders] = useState(false);

  const fetchOrders = useCallback(async () => {
    const response = await apiRequest(
      "GET",
      `${restaurantBills}/${user.restaurantId}?status=ongoing`
    );
    return response;
  }, [apiRequest, user.restaurantId]);

  const value = { fetchOrders, refreshOrders, setRefreshOrders };
  return (
    <BillingContext.Provider value={value}>{children}</BillingContext.Provider>
  );
};
