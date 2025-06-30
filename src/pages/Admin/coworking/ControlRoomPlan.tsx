import { useState } from 'react';
import { FormRoomPlan } from "../forms/FormRoomPlan";
import { TableRoomPlans } from "./TableRoomPlans";

const ControlRoomPlan = () => {
  const [activeTab, setActiveTab] = useState<'form' | 'table' | 'assign'>('form');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Pestañas */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('form')}
          className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
            activeTab === 'form'
              ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Nuevo Cliente
        </button>
        <button
          onClick={() => setActiveTab('table')}
          className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
            activeTab === 'table'
              ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Lista de Cliente con Planes
        </button>
      </div>

      {/* Contenido activo */}
      <div className="p-4">
        {activeTab === 'form' && <FormRoomPlan />}
        {activeTab === 'table' && <TableRoomPlans />}
      </div>
    </div>
  );
};

export default ControlRoomPlan;