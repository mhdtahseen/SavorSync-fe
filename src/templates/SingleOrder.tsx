//@ts-nocheck
import { Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { formatDateTime } from "../utils/functions";
import { ShoppingBag, Clock, Users, IndianRupee } from "lucide-react";

interface SingleOrderProps {
  data: {
    table?: {
      table_number: string | number;
    };
    bill_amount?: number;
    createdAt?: string;
    customer_count?: number;
    status?: 'pending' | 'served' | 'paid';
  };
  handleClick?: () => void;
  className?: string;
}

export const SingleOrder: React.FC<SingleOrderProps> = ({
  data,
  handleClick,
  className = '',
}) => {
  const [timestamp, setTimestamp] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    if (data?.createdAt) {
      setTimestamp(formatDateTime(data.createdAt));
    }
  }, [data]);

  // Status related code removed as it's not needed in the ActiveOrders tab

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative p-5 cursor-pointer min-w-[260px] bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 shadow-green-100 hover:shadow-green-200 ${
        isHovered ? 'border-green-500' : 'border-green-100'
      } ${className}`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-50 rounded-lg">
            <ShoppingBag className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <Typography variant="h6" className="text-gray-700 font-semibold">
              Table {data?.table?.table_number || 'N/A'}
            </Typography>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {timestamp.time || '--:--'}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-gray-500">{timestamp.date || 'Today'}</div>
          {data?.customer_count !== undefined && (
            <div className="flex items-center justify-end text-sm text-gray-600 mt-1">
              <Users className="w-3.5 h-3.5 mr-1" />
              {data.customer_count} {data.customer_count === 1 ? 'Person' : 'People'}
            </div>
          )}
        </div>
      </div>

      {/* Amount */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <Typography variant="small" className="text-gray-500 font-medium">
            Total Amount
          </Typography>
          <div className="flex items-center">
            <IndianRupee className="w-4 h-4 text-gray-700 mr-1" />
            <Typography variant="h5" className="text-gray-800 font-bold">
              {data?.bill_amount?.toFixed(2) || '0.00'}
            </Typography>
          </div>
        </div>
      </div>

      {/* Hover effect indicator */}
      <div 
        className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-400 to-green-300 rounded-b-lg transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
