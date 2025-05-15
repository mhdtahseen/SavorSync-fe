import React, { useContext, useEffect, useRef, useState } from "react";
// import { useSelector } from "react-redux";
// import useApiRequest from "../../../../utils/hooks/useApi";
// import { restaurantBills } from "../../../../utils/endpoints";
import { SingleOrder } from "../../../../templates/SingleOrder";
import { MTDialog } from "../../../../components/MTDialog/MTDialog";
import { MenuOperations } from "../../../../templates/menuOp";
import { BillingContext } from "../../../../utils/context/billingContext";
import { PaymentPortal } from "../../../../templates/PaymentPortal";
import MTButton from "../../../../components/MTButton/MTButton";

export const ActiveOrders = () => {
  const [activeOrders, setActiveOrders] = useState<any>();
  const [paymentPortal, setPaymentPortal] = useState(false);
  const [openDialog, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // const user = useSelector((state: any) => state.user);
  // const { apiRequest } = useApiRequest();

  const { fetchOrders, refreshOrders, setRefreshOrders } =
    useContext(BillingContext);

  const handleDialog = (order?: any, forceClose = false) => {
    if (forceClose) {
      setOpen(false);
      setRefreshOrders(true);
      return;
    }
    if (order) {
      setSelectedOrder(order); // Set selected order before opening dialog
    }
    if (openDialog) {
      setRefreshOrders(true);
    }
    setPaymentPortal(false);
    setOpen(!openDialog);
  };

  useEffect(() => {
    const getOrders = async () => {
      const response = await fetchOrders();
      setActiveOrders(response.bills);
    };
    getOrders();
  }, []);

  useEffect(() => {
    if (refreshOrders) {
      const refetch = async () => {
        const response = await fetchOrders();
        setActiveOrders(response.bills);
        setRefreshOrders(false); // reset trigger
      };
      refetch();
    }
  }, [refreshOrders]);

  const handleNewOrder = () => {
    setSelectedOrder(null);
    setOpen(true);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Active Orders</h2>
        <MTButton
          variant="gradient"
          color="green"
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          handleClick={handleNewOrder}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-semibold">New Order</span>
        </MTButton>
      </div>
      
      <div className="flex-1 overflow-auto">
        <MTDialog size={"sm"} open={openDialog} handler={handleDialog}>
          {paymentPortal ? (
            <PaymentPortal
              data={selectedOrder}
              closeDialog={() => handleDialog(undefined, true)}
            />
          ) : (
            <MenuOperations
              existingOrder={!!selectedOrder}
              data={selectedOrder}
              initiatePayment={() => setPaymentPortal(true)}
              closeDialog={() => handleDialog(undefined, true)}
            />
          )}
        </MTDialog>
        
        <div className="flex flex-wrap gap-4">
          {activeOrders?.map((order: any) => (
            <SingleOrder
              handleClick={() => handleDialog(order)}
              data={order}
              key={order?._id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
