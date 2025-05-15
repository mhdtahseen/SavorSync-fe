import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";

// Utils
import useApiRequest from "../utils/hooks/useApi";
import { bill, restaurantBase, tables as tablesBase } from "../utils/endpoints";
import { transformMenuItems } from "../utils/functions";

// Components
import MTAutocomplete from "../components/autocomplete/MTAutocomplete";

// Redux
import { setMenu as setMenuAction } from "../pages/Home/Billing/slices/userSlice";

interface MenuItem {
  _id: string;
  item_name: string;
  price: number;
  // Add other menu item properties as needed
}

interface OrderItem {
  menu_id: MenuItem;
  quantity: number;
}

interface TableType {
  _id: string;
  table_number: string;
  // Add other table properties as needed
}

interface OrderDataType {
  _id?: string;
  order_number?: string;
  table?: TableType;
  items: OrderItem[];
  bill_amount?: number;
  // Add other order properties as needed
}

// Define the type for the entire Redux state
interface RootState {
  user: UserState;
  // Add other slices of the state as needed
}

// Create typed hook for selector
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

interface UserState {
  restaurantId: string;
  menu: MenuItem[];
  // Add other user properties as needed
}

interface MenuOperationsProps {
  existingOrder?: boolean;
  data?: OrderDataType;
  closeDialog: () => void;
  initiatePayment?: () => void;
}

export const MenuOperations: React.FC<MenuOperationsProps> = ({
  existingOrder = false,
  data,
  closeDialog,
  initiatePayment,
}) => {
  const user = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = React.useRef(true);
  const [selection, setSelection] = useState<{
    menu_id: MenuItem | null;
    quantity: number;
  }>({
    menu_id: null,
    quantity: 1,
  });

  // Debug effect (uncomment when needed)
  // useEffect(() => {
  //   console.log("Current selection state:", selection);
  // }, [selection]);
  const [tables, setTables] = useState<TableType[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | undefined>(undefined);
  const [newOrder, setNewOrder] = useState<{ items: OrderItem[] }>({
    items: [],
  });
  const [billAmount, setBillAmount] = useState<number>(0);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const dispatch = useDispatch();
  const { apiRequest } = useApiRequest();
  
  // Cleanup effect to set isMounted to false when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (existingOrder && data) {
          setNewOrder(data);
          setBillAmount(data?.bill_amount || 0);
        }

        // Always fetch fresh menu data
        try {
          // First, get the restaurant to access its menu
          const restaurantResponse = await apiRequest(
            "GET",
            `${restaurantBase}/${user.restaurantId}`
          );
          
          console.log("Restaurant response:", restaurantResponse);
          
          // The menu items are directly in the restaurant's data
          const menuItems = restaurantResponse?.data?.menu || [];
          
          if (menuItems && Array.isArray(menuItems) && menuItems.length > 0) {
            console.log(`Loaded ${menuItems.length} menu items`);
            // Dispatch the menu to Redux store
            dispatch(setMenuAction(menuItems));
            // Update local state
            setMenu(menuItems);
            console.log("Menu items loaded:", menuItems);
          } else {
            console.warn("No menu items found in restaurant data");
            setMenu([]);
          }
        } catch (error) {
          console.error("Error fetching restaurant menu:", error);
          setMenu([]);
        }

        // Fetch tables if new order
        if (!existingOrder) {
          try {
            const tablesResponse = await apiRequest(
              "GET",
              `${tablesBase}/${user.restaurantId}?status=available`
            );
            console.log("Tables response:", tablesResponse);
            setTables(tablesResponse?.tables || []);
          } catch (error) {
            console.error("Error fetching tables:", error);
            setTables([]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiRequest, data, dispatch, existingOrder, user.restaurantId]);
  
  // Debug effect to log when menu changes
  useEffect(() => {
    console.log('Menu updated, items count:', menu.length);
  }, [menu]);

  useEffect(() => {
    if (newOrder.items.length > 0) {
      const total = newOrder.items.reduce((sum, item) => {
        return sum + (item.menu_id?.price || 0) * item.quantity;
      }, 0);
      setBillAmount(total);
    } else {
      setBillAmount(0);
    }
  }, [newOrder.items]);

  const handleTableChange = (value: string | undefined) => {
    if (value) {
      setSelectedTable(value);
    }
  };

  const menuSelection = useCallback(
    (value: string | undefined) => {
      if (!value) {
        setSelection(prev => ({
          ...prev,
          menu_id: null,
        }));
        return;
      }

      const selectedItem = menu.find(item => item._id === value);

      if (selectedItem) {
        setSelection(prev => ({
          ...prev,
          menu_id: selectedItem,
          quantity: Math.max(1, prev.quantity || 1),
        }));
      }
    },
    [menu]
  );

  const handleQuantity = useCallback((value: string) => {
    // Only update if the input is a valid number or empty string
    if (value === '' || /^\d+$/.test(value)) {
      const numValue = value === '' ? 1 : parseInt(value, 10);
      setSelection(prev => ({
        ...prev,
        quantity: Math.max(1, numValue)
      }));
    }
  }, []);

  const incrementQuantity = useCallback(() => {
    setSelection((prev) => ({
      ...prev,
      quantity: (prev.quantity || 1) + 1,
    }));
  }, []);

  const decrementQuantity = useCallback(() => {
    setSelection((prev) => ({
      ...prev,
      quantity: Math.max(1, (prev.quantity || 1) - 1),
    }));
  }, []);

  const addItem = useCallback(() => {
    if (!selection.menu_id) return;
    
    const menuId = selection.menu_id._id;
    const quantity = selection.quantity || 1;

    setNewOrder((prev) => {
      const existingIndex = prev.items.findIndex(
        (item) => item.menu_id._id === menuId
      );

      const updatedItems = [...prev.items];

      if (existingIndex !== -1) {
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + quantity,
        };
      } else if (selection.menu_id) {
        updatedItems.push({
          menu_id: selection.menu_id,
          quantity,
        });
      }

      return { ...prev, items: updatedItems };
    });

    // Reset selection
    setSelection({
      menu_id: null,
      quantity: 1,
    });
  }, [selection.menu_id, selection.quantity]);

  const removeItem = useCallback((index: number) => {
    setNewOrder((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }, []);

  const updateItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setNewOrder((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        quantity: newQuantity,
      };
      return { ...prev, items: updatedItems };
    });
  };

  const createOrder = async () => {
    if (!selectedTable || newOrder.items.length === 0) return;

    setIsLoading(true);
    try {
      const order = {
        restaurant: user?.restaurantId,
        table: selectedTable,
        items: transformMenuItems(newOrder.items),
      };

      const response = await apiRequest("POST", bill, order);
      if (response) {
        closeDialog();
      }
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const { apiRequest: makeApiRequest } = useApiRequest();

  const updateOrder = async (): Promise<void> => {
    if (!data?._id) {
      console.error("Cannot update order: Missing order ID");
      alert("Error: Missing order ID");
      return;
    }

    if (newOrder.items.length === 0) {
      console.error("Cannot update order: No items in the order");
      alert("Please add at least one item to the order");
      return;
    }

    setIsLoading(true);

    try {
      // Transform items to match backend's expected format
      const itemsForBackend = newOrder.items
        .filter(item => item.menu_id && item.quantity > 0) // Filter out invalid items
        .map((item) => ({
          menu_id: {
            _id: typeof item.menu_id === 'object' ? item.menu_id._id : item.menu_id
          },
          quantity: Number(item.quantity) || 1
        }));

      console.log(
        "Updating order with items:",
        JSON.stringify({ items: itemsForBackend }, null, 2)
      );

      // Make sure we're sending the correct data structure
      const payload = {
        items: itemsForBackend.map(item => ({
          menu_id: item.menu_id._id,
          quantity: item.quantity
        }))
      };

      console.log("Sending payload:", JSON.stringify(payload, null, 2));

      // Use the makeApiRequest from useApi hook
      const response = await makeApiRequest("PATCH", `${bill}/${data._id}`, payload);

      console.log("Update order response:", response);

      if (response) {
        console.log("Order updated successfully");
        // Close the dialog immediately without delay
        closeDialog();
        return; // Exit early to prevent state updates after closure
      } 
      
      throw new Error("No response data from server");
      
    } catch (error: unknown) {
      console.error("Error updating order:", error);
      let errorMessage = "An error occurred while updating the order";

      if (error instanceof Error) {
        console.error("Error details:", {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
        errorMessage = error.message;
      }

      alert(`Error: ${errorMessage}`);
    } finally {
      // Only update state if component is still mounted
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const handleCompletePayment = () => {
    if (initiatePayment) {
      initiatePayment();
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">
          {existingOrder ? "Update Order" : "Create New Order"}
        </h3>
        <p className="text-sm text-gray-500">
          {existingOrder
            ? `Order #${data?.order_number || ""}`
            : "Add items to create a new order"}
        </p>
      </div>

      {/* Table Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Table</label>
        {!existingOrder ? (
          <div className="w-full">
            <MTAutocomplete
              label="Select a table"
              options={tables.map(table => ({
                ...table,
                item_name: `Table ${table.table_number}`
              }))}
              value={selectedTable}
              onChange={(value) => {
                const selected = tables.find(t => t.table_number === value.replace('Table ', ''));
                if (selected) {
                  handleTableChange(selected._id);
                }
              }}
              onSelect={(selectedTable) => {
                handleTableChange(selectedTable._id);
              }}
              placeholder="Search tables..."
            />
          </div>
        ) : (
          <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700">
            {data?.table?.table_number || "N/A"}
          </div>
        )}
      </div>

      {/* Add Item Section */}
      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-3 items-end">
          <div className="col-span-6">
            <div className="w-full">
              <div className="w-full">
                <MTAutocomplete
                  label="Search Menu Item"
                  options={menu}
                  value={selection?.menu_id?._id}
                  onChange={(value) => {
                    // Handle text input changes if needed
                    const selected = menu.find(item => item.item_name.toLowerCase() === value.toLowerCase());
                    if (selected) {
                      menuSelection(selected._id);
                    }
                  }}
                  onSelect={(selectedItem) => {
                    menuSelection(selectedItem._id);
                  }}
                  placeholder="Search for menu items..."
                />
              </div>
            </div>
          </div>
          <div className="col-span-3">
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                onClick={decrementQuantity}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                type="button"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="1"
                value={selection.quantity}
                onChange={(e) => handleQuantity(e.target.value)}
                className="w-full px-2 py-2 text-center border-0 focus:ring-0"
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => {
                  // Prevent negative numbers and decimal points
                  if (['-', 'e', 'E', '+', '.'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <button
                onClick={incrementQuantity}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                type="button"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="col-span-3">
            <button
              onClick={addItem}
              disabled={!selection?.menu_id?._id}
              className={`w-full h-10 flex items-center justify-center rounded-md ${
                selection?.menu_id?._id
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              } transition-colors`}
              title={
                !selection?.menu_id?._id ? "Please select a menu item" : ""
              }
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Order Items */}
      {newOrder.items.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 p-3 text-sm font-medium text-gray-600">
            <div className="col-span-5">Item</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-1"></div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {newOrder.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 items-center p-3 border-t hover:bg-gray-50"
              >
                <div className="col-span-5 font-medium">
                  {item.menu_id.item_name}
                </div>
                <div className="col-span-2 text-center">
                  ₹{item.menu_id.price}
                </div>
                <div className="col-span-2">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() =>
                        updateItemQuantity(index, item.quantity - 1)
                      }
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="mx-2 w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateItemQuantity(index, item.quantity + 1)
                      }
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="col-span-2 text-right font-medium">
                  ₹{(item.quantity * item.menu_id.price).toFixed(2)}
                </div>
                <div className="col-span-1 text-right">
                  <button
                    onClick={() => removeItem(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <ShoppingBag className="w-10 h-10 mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">No items added yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Select items from the menu to get started
          </p>
        </div>
      )}

      {/* Total and Actions */}
      <div className="mt-2">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-green-700">
              ₹{billAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={closeDialog}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancel
          </button>

          {existingOrder ? (
            <>
              <button
                onClick={updateOrder}
                disabled={newOrder.items.length === 0 || isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Order
              </button>
              <button
                onClick={handleCompletePayment}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Payment
              </button>
            </>
          ) : (
            <button
              onClick={createOrder}
              disabled={
                !selectedTable || newOrder.items.length === 0 || isLoading
              }
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
