import { useState } from "react";
import FormCase from "./forms/FormCase";
import { TableCases } from "./tables/TableCases";

const AdminCases = () => {
  const [activeTab, setActiveTab] = useState<"table" | "form">("table");

  return (
    <div className="p-4">
      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "table"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("table")}
        >
          Lista de Casos
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "form"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("form")}
        >
          Crear Caso
        </button>
      </div>

      {activeTab === "table" ? <TableCases /> : <FormCase />}
    </div>
  );
};

export default AdminCases;