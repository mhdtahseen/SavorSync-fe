import React from "react";
import { IndianRupee } from "lucide-react";

interface OrderItem {
  menu_id: {
    _id: string;
    item_name: string;
    price: number;
  };
  quantity: number;
}

interface ViewMenuProps {
  data: OrderItem[];
  bill_amount?: number;
}

export const ViewMenu: React.FC<ViewMenuProps> = ({ data = [], bill_amount = 0 }) => {
  // Calculate total if not provided
  const total = bill_amount > 0 
    ? bill_amount 
    : data.reduce((sum, item) => sum + (item.menu_id.price * item.quantity), 0);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Order Details
      </h2>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-500 border-b">
          <div className="col-span-6">Item</div>
          <div className="col-span-2 text-center">Price</div>
          <div className="col-span-2 text-center">Qty</div>
          <div className="col-span-2 text-right">Amount</div>
        </div>
        
        {/* Order Items */}
        <div className="divide-y divide-gray-100">
          {data.map((item, index) => (
            <div 
              key={`${item.menu_id._id}-${index}`}
              className="grid grid-cols-12 items-center px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="col-span-6 font-medium text-gray-800">
                {item.menu_id.item_name}
              </div>
              <div className="col-span-2 text-center text-gray-600">
                ₹{item.menu_id.price.toFixed(2)}
              </div>
              <div className="col-span-2 text-center text-gray-600">
                {item.quantity}
              </div>
              <div className="col-span-2 text-right font-medium text-gray-800">
                ₹{(item.quantity * item.menu_id.price).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        
        {/* Total */}
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total</span>
            <div className="flex items-center">
              <IndianRupee className="w-4 h-4 mr-1 text-gray-700" />
              <span className="text-lg font-bold text-gray-900">
                {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
