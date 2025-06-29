import { useState } from 'react';
import { FormRoom } from '../forms/FormRoom';
import { TableRooms } from './TableRooms';
import ControlCoworking from './ControlCoworking';
import CreateAppointment from './CreateAppointment';

export const OficinasAdmin = () => {
  const [activeTab, setActiveTab] = useState<'lista' | 'nueva' | 'control' | 'create'>('lista');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Navegación por tabs */}
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
      </div>

      {/* Contenido de los tabs */}
      <div className="p-4">
        {activeTab === 'lista' && <TableRooms />}
        {activeTab === 'nueva' && <FormRoom />}
        {activeTab === 'control' && <ControlCoworking />}
        {activeTab === 'create' && <CreateAppointment />}
      </div>
    </div>
  );
};

export default OficinasAdmin;