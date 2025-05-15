import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export const AgGrid = (props: any) => {
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      filter: true,
      // editable: true,
      // floatingFilter: true,
    };
  }, []);

  return (
    <div
      className="ag-theme-quartz w-full h-full" // applying the grid theme
      //   style={{ height: 607 }} // the grid will fill the size of the parent container
    >
      <AgGridReact
        rowData={props?.rowData}
        columnDefs={props?.columnDefs}
        onCellValueChanged={props?.onCellValueChanged}
        pagination={true}
        paginationPageSize={20}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        defaultColDef={props?.defaultColDef || defaultColDef}
      />
    </div>
  );
};
