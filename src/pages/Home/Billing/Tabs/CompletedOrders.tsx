import React, { useCallback, useContext, useEffect, useState } from "react";
import { AgGrid } from "../../../../components/AG-Grid/AgGrid";
import { restaurantBills } from "../../../../utils/endpoints";
import { useSelector } from "react-redux";
import useApiRequest from "../../../../utils/hooks/useApi";
import { COMPLETED_COL_DEF } from "../../../../utils/constants/AG-Grid_ColDef";
import { BillingContext } from "../../../../utils/context/billingContext";

export const CompletedOrders = () => {
  const [completedOrders, setCompletedOrders] = useState<any>();
  const user = useSelector((state: any) => state.user);
  const { apiRequest } = useApiRequest();
  const { refreshOrders } = useContext(BillingContext);

  const fetchCompletedOrders = useCallback(async () => {
    const response = await apiRequest(
      "GET",
      `${restaurantBills}/${user.restaurantId}?status=completed`
    );
    // return response;
    console.log(response);
    setCompletedOrders(response?.bills);
  }, [apiRequest, user.restaurantId]);

  useEffect(() => {
    fetchCompletedOrders();
  }, [refreshOrders]);

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Completed Orders</h2>
      <div className="flex-1 overflow-auto">
        <AgGrid columnDefs={COMPLETED_COL_DEF} rowData={completedOrders} />
      </div>
    </div>
  );
};
