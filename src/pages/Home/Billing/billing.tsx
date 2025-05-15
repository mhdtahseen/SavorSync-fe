import React, { useState } from "react";
import { ActiveOrders } from "./Tabs/ActiveOrders";
import { CompletedOrders } from "./Tabs/CompletedOrders";

type OrderViewType = 'active' | 'completed';

export const Billing = () => {
  const [activeView, setActiveView] = useState<OrderViewType>('active');

  const handleViewChange = (view: OrderViewType) => {
    setActiveView(view);
  };

  return (
    <div className="flex flex-col h-full p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>
      
      {/* View Toggle */}
      <div className="mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => handleViewChange('active')}
            className={`px-6 py-2 text-sm font-medium rounded-l-lg border ${
              activeView === 'active'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Active Orders
          </button>
          <button
            type="button"
            onClick={() => handleViewChange('completed')}
            className={`px-6 py-2 text-sm font-medium rounded-r-lg border ${
              activeView === 'completed'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Completed Orders
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {activeView === 'active' ? <ActiveOrders /> : <CompletedOrders />}
      </div>
    </div>
  );
};
