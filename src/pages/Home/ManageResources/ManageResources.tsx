import React, { useCallback, useEffect, useRef, useState } from "react";
import { Download, Upload, Plus } from "lucide-react";
import { restaurantBase, tables } from "../../../utils/endpoints";
import {
  MENU_COL_DEF,
  TABLE_COL_DEF,
  EDITABLE_DEFAULT_COL_DEF,
} from "../../../utils/constants/AG-Grid_ColDef";
import useApi from "../../../utils/hooks/useApi";
import { AgGrid } from "../../../components/AG-Grid/AgGrid";
import { useSelector } from "react-redux";
import { ColDef, CellValueChangedEvent } from "ag-grid-community";
import MTButton from "../../../components/MTButton/MTButton";

interface RootState {
  user: {
    restaurantId: string;
  };
}

interface MenuItem {
  _id: string;
  item_name: string;
  price: number;
  description: string;
  is_available: boolean;
}

interface TableItem {
  _id: string;
  table_number: string;
  capacity: number;
  is_occupied: boolean;
}

export const ManageResources = () => {
  const [view, setView] = useState<"menu" | "tables">("menu");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [gridData, setGridData] = useState<{
    columnDefs: ColDef[];
    rowData: (MenuItem | TableItem)[];
  }>({
    columnDefs: [],
    rowData: [],
  });

  const user = useSelector((state: RootState) => state.user);
  const { apiRequest } = useApi();

  const fetchMenu = useCallback(async () => {
    try {
      const res = await apiRequest(
        "GET",
        `${restaurantBase}/${user?.restaurantId}/menu`
      );
      const menuData = Array.isArray(res?.data?.menu) ? res.data.menu : [];
      setGridData({ columnDefs: MENU_COL_DEF as ColDef[], rowData: menuData });
    } catch (error) {
      console.error("Error fetching menu:", error);
      setGridData({ columnDefs: MENU_COL_DEF as ColDef[], rowData: [] });
    }
  }, [apiRequest, user?.restaurantId]);

  const fetchTables = useCallback(async () => {
    try {
      const res = await apiRequest("GET", `${tables}/${user?.restaurantId}`);
      const tablesData = Array.isArray(res?.tables) ? res.tables : [];
      setGridData({
        columnDefs: TABLE_COL_DEF as ColDef[],
        rowData: tablesData,
      });
    } catch (error) {
      console.error("Error fetching tables:", error);
      setGridData({ columnDefs: TABLE_COL_DEF as ColDef[], rowData: [] });
    }
  }, [apiRequest, user?.restaurantId]);

  const handleViewChange = (key: "menu" | "tables") => {
    setView(key);
  };

  const handleDownloadTemplate = async () => {
    try {
      const endpoint =
        view === "menu"
          ? `${restaurantBase}/${user?.restaurantId}/menu/template`
          : `${tables}/template`;

      const response = await apiRequest("GET", endpoint, null, {}, "blob");

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${view}-template.xlsx`);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading template:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const endpoint =
        view === "menu"
          ? `${restaurantBase}/${user?.restaurantId}/menu/upload`
          : `${tables}/${user?.restaurantId}/upload`;

      const response: any = await apiRequest("POST", endpoint, formData, {
        // Remove Content-Type header - let browser set it automatically with boundary
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === "Success") {
        view === "menu" ? await fetchMenu() : await fetchTables();
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setIsUploadModalOpen(false);
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
    }
  };

  const handleAddNew = () => {
    console.log("Add new", view, "item");
    // Open add modal or form logic (future enhancement)
  };

  const handleCellValueChanged = useCallback(
    async (event: CellValueChangedEvent) => {
      const field = event.column.getColId();
      const newValue = event.newValue;
      const oldValue = event.oldValue;
      const itemId = event.data._id;

      if (newValue === oldValue || !field) return;

      try {
        const updatePayload = { [field]: newValue };
        const updatedData =
          gridData.rowData?.map((item) =>
            item._id === itemId ? { ...item, [field]: newValue } : item
          ) || [];

        setGridData((prev) => ({ ...prev, rowData: updatedData }));

        const endpoint =
          view === "menu"
            ? `${restaurantBase}/${user?.restaurantId}/menu/${itemId}`
            : `${tables}/${user?.restaurantId}/${itemId}`;

        await apiRequest("PATCH", endpoint, updatePayload);
      } catch (error) {
        console.error("Patch error:", error);
        event.node.setDataValue(field, oldValue);
      }
    },
    [apiRequest, user?.restaurantId, view, gridData.rowData]
  );

  useEffect(() => {
    view === "menu" ? fetchMenu() : fetchTables();
  }, [view, fetchMenu, fetchTables]);

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {view === "menu" ? "Menu Items" : "Tables"}
        </h1>
        <div className="flex space-x-3">
          <MTButton
            variant="outline"
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Template
          </MTButton>
          <MTButton
            variant="outline"
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import
          </MTButton>
          <MTButton
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="h-4 w-4" />
            Add New
          </MTButton>
        </div>
      </div>

      {/* Toggle View */}
      <div className="mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            onClick={() => handleViewChange("menu")}
            className={`px-6 py-2 text-sm font-medium rounded-l-lg border ${
              view === "menu"
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Menu Items
          </button>
          <button
            onClick={() => handleViewChange("tables")}
            className={`px-6 py-2 text-sm font-medium rounded-r-lg border ${
              view === "tables"
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Tables
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-hidden bg-white rounded-lg shadow">
        <div
          className="ag-theme-quartz w-full"
          style={{ height: "calc(100vh - 240px)" }}
        >
          <AgGrid
            columnDefs={gridData.columnDefs}
            rowData={gridData.rowData}
            defaultColDef={{
              ...EDITABLE_DEFAULT_COL_DEF,
              resizable: true,
              sortable: true,
              filter: true,
            }}
            onCellValueChanged={
              view === "menu" ? handleCellValueChanged : undefined
            }
            pagination={true}
            paginationPageSize={10}
            domLayout="autoHeight"
          />
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          key="upload-modal"
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Import {view === "menu" ? "Menu Items" : "Tables"}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select file (.xlsx, .csv)
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".xlsx, .xls, .csv"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-50 file:text-green-700
                  hover:file:bg-green-100"
              />
              <p className="mt-1 text-xs text-gray-500">
                Download the template file first to ensure correct format.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  selectedFile
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
