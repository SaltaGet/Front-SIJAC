import apiSijac from '@/api/sijac';
import useAuthStore from '@/store/useAuthStore';
import { QueryFunctionContext, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

// Tipo básico que recibe del padre
type BasicRoomAppointment = {
  id: string;
  date_get: string;
  start_time: string;
  state: 'nulo' | 'cancelado' | 'reservado' | 'pendiente' | 'aceptado' | string;
  group_id?: string | null;
  first_name?: string;
  last_name?: string;
};

// Tipo completo que obtiene del fetch
type FullRoomAppointment = BasicRoomAppointment & {
  end_time: string;
  email: string;
  cellphone: string;
  tuition: string;
  room_availability_id: string;
};

interface CardControlAppointmentProps {
  appointment: BasicRoomAppointment;
}

interface UpdateData {
  ids: string[];
  newState: 'nulo' | 'cancelado' | 'reservado' | 'pendiente' | 'aceptado';
}

const updateState = async (dataUpdate: UpdateData) => {
  const token = useAuthStore.getState().token;
  const { data } = await apiSijac.put(
    `/room_appointment/update_state?new_state=${dataUpdate.newState}`,
    {appointment_ids: dataUpdate.ids},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

const fetchDetailsAppointment = async (ctx: QueryFunctionContext): Promise<FullRoomAppointment> => {
  const [_, id] = ctx.queryKey;
  void _;
  const token = useAuthStore.getState().token;
  const { data } = await apiSijac.get<FullRoomAppointment>(`/room_appointment/get/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

const CardControlAppointment: React.FC<CardControlAppointmentProps> = ({ appointment }) => {
  const { id, start_time, state, first_name, last_name } = appointment;
  const [showDetails, setShowDetails] = useState(false);

  const { data: details, isLoading, isError, refetch } = useQuery<FullRoomAppointment>({
    queryKey: ['appointment-details', id],
    queryFn: fetchDetailsAppointment,
    enabled: false,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateState,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomAppointment'] });
      queryClient.invalidateQueries({ queryKey: ['appointment-details'] });
      queryClient.invalidateQueries({ queryKey: ['availabilityRooms'] });
      if (showDetails) {
        refetch();
      }
    },
  });

  const handleShowDetails = () => {
    if (!details && !isLoading) {
      refetch();
    }
    setShowDetails(!showDetails);
  };

  const handleUpdateState = (newState: UpdateData['newState']) => {
    mutation.mutate({ ids: [id], newState });
  };

  const formatTime = (timeString: string) => {
    return timeString.split('.')[0].replace('Z', '');
  };

  // Opciones de estado disponibles
  const stateOptions: UpdateData['newState'][] = 
    state === 'nulo' 
      ? ['cancelado'] // Solo cancelar disponible para estado nulo
      : ['pendiente', 'aceptado', 'cancelado']; // Todas las opciones para otros estados

  return (
    <div 
      className="text-sm p-3 rounded-lg shadow-sm" 
      style={{
        backgroundColor: 
          state === 'pendiente' ? '#FEF3C7' :
          state === 'aceptado' ? '#D1FAE5' :
          state === 'cancelado' ? '#FEE2E2' :
          state === 'reservado' ? '#DBEAFE' :
          '#F3F4F6'
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-xs text-gray-600">
            Hora: {formatTime(start_time)} {details && `- ${formatTime(details.end_time)}`}
          </p>
          {(first_name || last_name) && (
            <p className="text-xs font-medium">
              {first_name} {last_name}
            </p>
          )}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          state === 'pendiente' ? 'bg-yellow-500 text-white' :
          state === 'aceptado' ? 'bg-green-500 text-white' :
          state === 'cancelado' ? 'bg-red-500 text-white' :
          state === 'reservado' ? 'bg-blue-500 text-white' :
          'bg-gray-500 text-white'
        }`}>
          {state.toUpperCase()}
        </span>
      </div>

      {/* Botones para cambiar el estado */}
      <div className="flex flex-wrap gap-1 mt-2">
        {stateOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleUpdateState(option)}
            disabled={mutation.isPending || state === option}
            className={`px-2 py-1 rounded text-xs font-medium ${
              option === 'pendiente' ? 'bg-yellow-100 hover:bg-yellow-200' :
              option === 'aceptado' ? 'bg-green-100 hover:bg-green-200' :
              option === 'cancelado' ? 'bg-red-100 hover:bg-red-200' :
              option === 'reservado' ? 'bg-blue-100 hover:bg-blue-200' :
              'bg-gray-100 hover:bg-gray-200'
            } ${state === option ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {/* Mostrar botón de detalles solo si el estado no es "nulo" */}
      {state !== 'nulo' && (
        <>
          <button
            onClick={handleShowDetails}
            className="mt-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs transition-colors"
          >
            {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
          </button>

          {showDetails && (
            <>
              {isLoading ? (
                <p className="text-xs text-gray-500 mt-2">Cargando detalles...</p>
              ) : isError ? (
                <p className="text-xs text-red-500 mt-2">Error al cargar detalles</p>
              ) : details ? (
                <div className="mt-2 space-y-1">
                  <p className="text-xs">
                    <span className="font-medium">Nombre:</span> {details.first_name} {details.last_name}
                  </p>
                  <p className="text-xs">
                    <span className="font-medium">Matrícula:</span> {details.tuition || 'N/A'}
                  </p>
                  <p className="text-xs">
                    <span className="font-medium">Celular:</span> {details.cellphone || 'N/A'}
                  </p>
                  <p className="text-xs">
                    <span className="font-medium">Email:</span> {details.email || 'N/A'}
                  </p>
                </div>
              ) : null}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CardControlAppointment;