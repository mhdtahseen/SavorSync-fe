import { formatDateWithContext } from "../functions";
import { MTDialog } from "../../components/MTDialog/MTDialog";
import { ViewMenu } from "../../templates/ViewMenu";
import { Eye } from "lucide-react";
import { Checkbox } from "@material-tailwind/react";
import { useState } from "react";

interface CheckboxCellRendererParams {
  value: boolean;
  setValue: (value: boolean) => void;
  data: any;
  node: any;
  column: any;
  colDef: any;
  api: any;
  columnApi: any;
  context: any;
  onCellValueChanged?: (params: any) => void;
}

export const OrderList = (p) => {
  const [openDialog, setOpen] = useState(false);

  const handleDialog = () => {
    setOpen(!openDialog);
  };

  return (
    <>
      <MTDialog size={"sm"} open={openDialog} handler={handleDialog}>
        <ViewMenu data={p.value} />
      </MTDialog>
      <div className="pl-5 mt-3">
        <Eye onClick={handleDialog} className="cursor-pointer" size={20} />
      </div>
    </>
  );
};

export const checkAvailability = (p: CheckboxCellRendererParams) => {
  const [isChecked, setIsChecked] = useState<boolean>(p.value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setIsChecked(newValue);

    // Update the data
    if (p.setValue) {
      p.setValue(newValue);
    }

    // Update the row data
    const newData = { ...p.data, is_available: newValue };
    p.node.setDataValue("is_available", newValue);

    // Trigger the cell value changed event if it exists
    if (p.columnApi) {
      const colDef = p.columnApi.getColumn(p.column.colId).getColDef();
      if (colDef.onCellValueChanged) {
        colDef.onCellValueChanged({
          node: p.node,
          data: newData,
          oldValue: p.value,
          newValue: newValue,
          colDef: p.column.colDef,
          column: p.column,
          api: p.api,
          columnApi: p.columnApi,
          context: p.context,
        });
      }
    }
  };

  return (
    <div className="pl-3" onClick={(e) => e.stopPropagation()}>
      <Checkbox
        checked={isChecked}
        onChange={handleChange}
        crossOrigin={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
    </div>
  );
};

export const COMPLETED_COL_DEF = [
  { valueGetter: (p) => p?.data?.table?.table_number, headerName: "Table" },
  {
    field: "bill_amount",
    headerName: "Amount",
    valueFormatter: (p) => "₹" + p?.value.toLocaleString(),
  },
  {
    valueGetter: (p) => p?.data?.updatedAt,
    headerName: "Payment Time",
    filter: "agDateColumnFilter",
    valueFormatter: (p) => formatDateWithContext(p.value),
    filterParams: {
      comparator: (filterLocalDateAtMidnight, cellValue) => {
        const cellDate = new Date(cellValue);

        // Remove time part from cell date
        const cellDateNoTime = new Date(
          cellDate.getFullYear(),
          cellDate.getMonth(),
          cellDate.getDate()
        );

        if (cellDateNoTime < filterLocalDateAtMidnight) return -1;
        else if (cellDateNoTime > filterLocalDateAtMidnight) return 1;
        return 0;
      },
    },
  },
  {
    field: "payment_method",
    headerName: "Payment Method",
    valueFormatter: (p) => p?.value.toUpperCase(),
    editable: true,
  },
  { field: "items", headerName: "Order Items", cellRenderer: OrderList },
];

export const EDITABLE_DEFAULT_COL_DEF = {
  flex: 1,
  filter: true,
  editable: true,
};

export const MENU_COL_DEF = [
  {
    field: "item_name",
    headerName: "Item Name",
    valueGetter: (p) => p?.data?.item_name,
  },
  {
    field: "price",
    headerName: "Price",
    valueFormatter: (p) => "₹" + p?.value.toLocaleString(),
  },
  {
    field: "description",
    headerName: "Description",
    valueGetter: (p) => p?.data?.description,
  },
  {
    field: "is_available",
    headerName: "Available",
    cellRenderer: checkAvailability,
  },
];

export const TABLE_COL_DEF = [
  {
    field: "table_number",
    headerName: "Table Number",
    valueGetter: (p) => p?.data?.table_number,
  },
];
