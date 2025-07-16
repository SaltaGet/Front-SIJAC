import { useState } from 'react';
import { FormRoom } from '../forms/FormRoom';
import { TableRooms } from './TableRooms';
import ControlCoworking from './ControlCoworking';
import CreateAppointment from './CreateAppointment';
import ControlRoomPlan from './ControlRoomPlan';

export const OficinasAdmin = () => {
  // Agregamos 'room-plan' al tipo de activeTab
  const [activeTab, setActiveTab] = useState<'lista' | 'nueva' | 'control' | 'create' | 'room-plan'>('lista');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Solo agregamos un nuevo botón para Room Plan */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('lista')}
          className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
            activeTab === 'lista'
              ? 'border-b-2 border-prim-500 text-prim-600 bg-prim-50'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Lista de Oficinas
        </button>
        <button
          onClick={() => setActiveTab('nueva')}
          className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
            activeTab === 'nueva'
              ? 'border-b-2 border-prim-500 text-prim-600 bg-prim-50'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Nueva Oficina
        </button>
        <button
          onClick={() => setActiveTab('control')}
          className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
            activeTab === 'control'
              ? 'border-b-2 border-prim-500 text-prim-600 bg-prim-50'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Control
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
            activeTab === 'create'
              ? 'border-b-2 border-prim-500 text-prim-600 bg-prim-50'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Crear Cita
        </button>
        {/* Nuevo botón para Room Plan */}
        <button
          onClick={() => setActiveTab('room-plan')}
          className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
            activeTab === 'room-plan'
              ? 'border-b-2 border-prim-500 text-prim-600 bg-prim-50'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Plan de Sala
        </button>
      </div>

      {/* Contenido de los tabs (solo agregamos el render de ControlRoomPlan) */}
      <div className="p-4">
        {activeTab === 'lista' && <TableRooms />}
        {activeTab === 'nueva' && <FormRoom />}
        {activeTab === 'control' && <ControlCoworking />}
        {activeTab === 'create' && <CreateAppointment />}
        {activeTab === 'room-plan' && <ControlRoomPlan />}
      </div>
    </div>
  );
};

export default OficinasAdmin;