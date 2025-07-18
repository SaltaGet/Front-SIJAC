import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiSijac from "@/api/sijac";
import useAuthStore from "@/store/useAuthStore";
import { useRoomAppointmentGetAllByAvailibityId } from "@/hooks/roomAppoinment/useRoomAppointmentGetAllByAvailibityId";
import { useAvaliabilityRoomsByRoomId } from "@/hooks/availabilityRoom/useAvaliabilityRoomsByRoomId";
import { useState } from "react";
import CardControlAppointment from "../CardControlAppointment";
import { FormEditAvailibilty } from "../../forms/edit/FormEditAvailibilty";

interface AppointmentsViewProps {
  availabilityId: string;
  selectedDate: Date;
  roomId: string;
}

type RoomAppointment = {
  id: string;
  date_get: string;
  start_time: string;
  state: "nulo" | "cancelado" | "reservado" | "pendiente" | "aceptado" | string;
  group_id: string | null;
  first_name?: string;
  last_name?: string;
};

type UpdateData = {
  ids: string[];
  newState: 'nulo' | 'cancelado' | 'reservado' | 'pendiente' | 'aceptado';
};

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

const deleteAvailability = async (id: string) => {
  const token = useAuthStore.getState().token;
  const { data } = await apiSijac.delete(`/room_availability/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

const AppointmentsView = ({ availabilityId, selectedDate, roomId }: AppointmentsViewProps) => {
  const { data: appointments, isLoading: isLoadingAppointments } = 
    useRoomAppointmentGetAllByAvailibityId(availabilityId);
  const { data: availabilityData } = useAvaliabilityRoomsByRoomId(roomId);
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const mutation = useMutation({
    mutationFn: updateState,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomAppointment', availabilityId] });
      queryClient.invalidateQueries({ queryKey: ['availabilityRooms', roomId] });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availabilityRooms', roomId] });
      queryClient.invalidateQueries({ queryKey: ['roomAppointment'] });
      alert('Disponibilidad eliminada con éxito');
    },
    onError: () => {
      alert('Ocurrió un error al eliminar la disponibilidad. Por favor, contacte al administrador.');
    },
  });

  const handleUpdateState = (ids: string[], newState: UpdateData['newState']) => {
    mutation.mutate({ ids, newState });
  };

  const handleDeleteAvailability = (id: string) => {
    const confirmDelete = window.confirm('¿Está seguro que desea eliminar esta disponibilidad?');
    if (confirmDelete) {
      deleteMutation.mutate(id);
    }
  };

  const groupAppointments = (apps: RoomAppointment[]) => {
    return apps.reduce((acc, app) => {
      const groupKey = app.group_id || 'individual';
      return {
        ...acc,
        [groupKey]: [...(acc[groupKey] || []), app]
      };
    }, {} as Record<string, RoomAppointment[]>);
  };

  const groupedAppointments = appointments ? groupAppointments(appointments) : {};
  const stateOptions: UpdateData['newState'][] = ['pendiente', 'aceptado', 'cancelado'];

  const currentAvailability = availabilityData?.find(avail => avail.id === availabilityId);

  return (
    <div className="mt-4 p-3 border rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">
          {format(selectedDate, "EEEE d MMMM", { locale: es })}
        </h4>
        
        {currentAvailability && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            >
              Editar horario
            </button>
            <button
              onClick={() => handleDeleteAvailability(currentAvailability.id)}
              className="px-3 py-1 bg-red-200 rounded hover:bg-red-300 text-sm text-red-800"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        )}
      </div>

      {isLoadingAppointments ? (
        <p>Cargando reservas...</p>
      ) : (
        <div className="space-y-4">
          {appointments && appointments.length > 0 ? (
            <>
              {groupedAppointments['individual'] && (
                <div className="space-y-2">
                  {groupedAppointments['individual'].map((app) => (
                    <CardControlAppointment 
                      key={app.id} 
                      appointment={app} 
                    />
                  ))}
                </div>
              )}

              {Object.entries(groupedAppointments)
                .filter(([groupKey]) => groupKey !== 'individual')
                .map(([groupKey, groupApps]) => (
                  <div key={groupKey} className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 border-t border-gray-300"></div>
                      <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        Grupo {groupKey}
                      </span>
                      <div className="flex-1 border-t border-gray-300"></div>
                      
                      <div className="flex gap-1">
                        {stateOptions.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleUpdateState(
                              groupApps.map(a => a.id),
                              option
                            )}
                            disabled={mutation.isPending}
                            className={`px-2 py-0.5 rounded text-xs ${
                              option === 'pendiente' ? 'bg-yellow-100 hover:bg-yellow-200' :
                              option === 'aceptado' ? 'bg-green-100 hover:bg-green-200' :
                              option === 'cancelado' ? 'bg-red-100 hover:bg-red-200' :
                              option === 'reservado' ? 'bg-blue-100 hover:bg-blue-200' :
                              'bg-gray-100 hover:bg-gray-200'
                            }`}
                            title={`Marcar todo el grupo como ${option}`}
                          >
                            {option.charAt(0).toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                    {groupApps.map((app) => (
                      <CardControlAppointment 
                        key={app.id} 
                        appointment={app} 
                      />
                    ))}
                  </div>
                ))}
            </>
          ) : (
            <p className="text-gray-500 text-sm">No hay reservas este día</p>
          )}
        </div>
      )}

      {/* Modal de edición de disponibilidad */}
      {isEditModalOpen && currentAvailability && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <FormEditAvailibilty
              id={currentAvailability.id}
              start_time={currentAvailability.start_time}
              end_time={currentAvailability.end_time}
              onClose={() => setIsEditModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsView;