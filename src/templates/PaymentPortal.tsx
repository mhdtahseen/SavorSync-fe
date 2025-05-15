import React, { useState } from "react";
import { Check, CreditCard, Smartphone } from "lucide-react";
import useApiRequest from "../utils/hooks/useApi";
import { bill } from "../utils/endpoints";

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash", icon: CreditCard },
  { value: "upi", label: "UPI", icon: Smartphone },
];



interface PaymentPortalProps {
  data: {
    _id: string;
    restaurant: string;
    bill_amount: number;
  };
  closeDialog: () => void;
}

export const PaymentPortal: React.FC<PaymentPortalProps> = ({ data, closeDialog }) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { apiRequest } = useApiRequest();

  const handlePaymentSelection = (method: string) => {
    setSelectedMethod(method);
  };

  const completePayment = async () => {
    if (!selectedMethod) {
      alert("Please select a payment method");
      return;
    }

    setIsProcessing(true);
    try {
      const paymentData = {
        restaurant_id: data.restaurant,
        payment_method: selectedMethod,
      };

      const response = await apiRequest(
        "PATCH",
        `${bill}/${data._id}/payment`,
        paymentData
      );

      if (response) {
        closeDialog();
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Complete Payment</h2>
      
      {/* Amount Display */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6 text-center">
        <p className="text-sm text-gray-500 mb-1">Total Amount</p>
        <p className="text-4xl font-bold text-green-600">₹{data.bill_amount?.toFixed(2)}</p>
      </div>

      {/* Payment Methods */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Select Payment Method</h3>
        <div className="space-y-3">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.value}
              onClick={() => handlePaymentSelection(method.value)}
              className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
                selectedMethod === method.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <method.icon className="w-5 h-5 text-gray-600 mr-3" />
                <span className="font-medium">{method.label}</span>
              </div>
              {selectedMethod === method.value && (
                <Check className="w-5 h-5 text-green-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={closeDialog}
          className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={completePayment}
          disabled={!selectedMethod || isProcessing}
          className={`flex-1 py-3 px-4 rounded-lg text-white font-medium transition-colors ${
            selectedMethod && !isProcessing
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {isProcessing ? 'Processing...' : 'Confirm Payment'}
        </button>
      </div>
    </div>
  );
};
