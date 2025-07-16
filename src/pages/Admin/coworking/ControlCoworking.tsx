import { Availability, useAvaliabilityRoomsByRoomId } from "@/hooks/availabilityRoom/useAvaliabilityRoomsByRoomId";
import { useGetAllRooms } from "@/hooks/room/useGetAllRooms";
import { useState } from "react";
import {
  format,
  parseISO,
  isSameDay,
  addMonths,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isAfter,
  getDay,
  subDays,
} from "date-fns";
import { es } from "date-fns/locale";
import CardControlAppointment from "./CardControlAppointment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiSijac from "@/api/sijac";
import useAuthStore from "@/store/useAuthStore";
import { FormEditAvailibilty } from "../forms/edit/FormEditAvailibilty";
import { useRoomAppointmentGetAllByAvailibityId } from "@/hooks/roomAppoinment/useRoomAppointmentGetAllByAvailibityId";

type Room = {
  id: string;
  name: string;
  type_room: string;
  description: string;
  price: number;
  url_image: string[];
  created_at: string;
};

type RoomAppointment = {
  id: string;
  date_get: string;
  start_time: string;
  state: "nulo" | "cancelado" | "reservado" | "pendiente" | "aceptado" | string;
  group_id: string | null;
  first_name?: string;
  last_name?: string;
};


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

const deleteAvailability = async (id: string) => {
  const token = useAuthStore.getState().token;
  const { data } = await apiSijac.delete(`/room_availability/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

const ControlCoworking = () => {
  const { rooms, isLoading } = useGetAllRooms();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const queryClient = useQueryClient();

  const { data: availabilityData, isLoading: isLoadingAvailability } =
    useAvaliabilityRoomsByRoomId(selectedRoomId || "");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<string | null>(null);
  const { data: appointments, isLoading: isLoadingAppointments } =
    useRoomAppointmentGetAllByAvailibityId(selectedAvailabilityId || "");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [availabilityToEdit, setAvailabilityToEdit] = useState<Availability | null>(null);

  const mutation = useMutation({
    mutationFn: updateState,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomAppoinment', selectedAvailabilityId] });
    },
  });
  

  const deleteMutation = useMutation({
    mutationFn: deleteAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availabilityRooms', selectedRoomId] });
      queryClient.invalidateQueries({ queryKey: ['roomAppoinment'] });
      alert('Disponibilidad eliminada con éxito');
      setSelectedDate(null);
      setSelectedAvailabilityId(null);
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

  const openEditModal = (availability: Availability) => {
    setAvailabilityToEdit(availability);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setAvailabilityToEdit(null);
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

  // Función para obtener los días del mes con alineación correcta
  const getCalendarDays = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start, end });

    // Obtener el día de la semana del primer día del mes (0 = Domingo, 1 = Lunes...)
    const startWeekday = getDay(start);
    
    // Ajustar para que la semana empiece en Lunes (1)
    const offset = startWeekday === 0 ? 6 : startWeekday - 1;
    
    // Agregar días del mes anterior para completar la primera semana
    const previousMonthDays = offset > 0 
      ? eachDayOfInterval({
          start: subDays(start, offset),
          end: subDays(start, 1)
        })
      : [];

    return [...previousMonthDays, ...daysInMonth];
  };

  // Obtener disponibilidad para un día específico
  const getDayAvailability = (day: Date) => {
    if (!availabilityData) return [];
    return availabilityData.filter((avail) =>
      isSameDay(parseISO(avail.date_all), day)
    );
  };

  // Determinar el estado predominante de un día
  const getDayState = (availabilities: Availability[]) => {
    if (availabilities.length === 0) return 'none';
    
    // Contar los estados de todas las disponibilidades del día
    const stateCounts = availabilities.reduce((acc, avail) => {
      if (avail.is_acepted) acc.aceptado = (acc.aceptado || 0) + 1;
      if (avail.is_pending) acc.pendiente = (acc.pendiente || 0) + 1;
      if (avail.is_reserved) acc.reservado = (acc.reservado || 0) + 1;
      if (avail.is_cancelled) acc.cancelado = (acc.cancelado || 0) + 1;
      if (avail.is_null) acc.nulo = (acc.nulo || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Determinar el estado predominante
    const maxState = Object.entries(stateCounts).reduce(
      (max, [state, count]) => count > (max.count || 0) ? { state, count } : max,
      { state: 'none', count: 0 }
    );

    return maxState.state;
  };

  // Obtener clase CSS basada en el estado
  const getDayClass = (day: Date, isCurrentMonth: boolean, isSelected: boolean | null) => {
  if (!isCurrentMonth) return "text-gray-300 bg-white";
  if (isSelected) return "bg-blue-500 text-white";

  const dayAvailabilities = getDayAvailability(day);
  const dayState = getDayState(dayAvailabilities);
  const isPast = !isAfter(day, new Date());

  if (dayAvailabilities.length === 0) {
    return isPast ? "bg-gray-100 text-gray-400" : "bg-white text-gray-800 border border-gray-200";
  }

  switch (dayState) {
    case 'aceptado':
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case 'pendiente':
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case 'reservado':
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case 'cancelado':
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case 'nulo':
      return "bg-gray-200 text-gray-800 hover:bg-gray-300";
    default:
      return "bg-white text-gray-800 border border-gray-200";
  }
};
  // Navegación entre meses
  const prevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  if (isLoading) return <div>Cargando salas...</div>;

  const groupedAppointments = appointments ? groupAppointments(appointments) : {};
  const stateOptions: UpdateData['newState'][] = ['pendiente', 'aceptado', 'cancelado', 'reservado'];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Control de Coworking</h2>

      {/* Selección de sala */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Salas disponibles:</h3>
        <div className="flex flex-wrap gap-3">
          {rooms.map((room: Room) => (
            <button
              key={room.id}
              onClick={() => {
                setSelectedRoomId(room.id);
                setSelectedDate(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                selectedRoomId === room.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {room.url_image.length > 0 && (
                <img
                  src={room.url_image[0]}
                  alt={room.name}
                  className="w-8 h-8 rounded object-cover"
                />
              )}
              {room.name}
            </button>
          ))}
        </div>
      </div>

      {selectedRoomId && isLoadingAvailability && <p>Cargando disponibilidad...</p>}

      {/* Calendario de disponibilidad */}
      {selectedRoomId && (
        <div className="mt-4">
          {/* Controles de navegación */}
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={prevMonth}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            >
              &larr;
            </button>
            <span className="font-medium">
              {format(currentMonth, "MMMM yyyy", { locale: es })}
            </span>
            <button
              onClick={nextMonth}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            >
              &rarr;
            </button>
          </div>

          {/* Vista de calendario completo y correctamente alineado */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {/* Encabezados de días de la semana */}
            {["L", "M", "X", "J", "V", "S", "D"].map((day, i) => (
              <div key={i} className="text-center text-xs font-medium py-1">
                {day}
              </div>
            ))}

            {/* Días del calendario */}
            {getCalendarDays().map((day, i) => {
              const isCurrentMonth = day >= startOfMonth(currentMonth) && day <= endOfMonth(currentMonth);
              const dayAvailabilities = isCurrentMonth ? getDayAvailability(day) : [];
              const isAvailable = dayAvailabilities.length > 0;
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <button
                  key={i}
                  onClick={() => {
                    if (isAvailable && isCurrentMonth) {
                      setSelectedDate(day);
                      setSelectedAvailabilityId(dayAvailabilities[0]?.id || null);
                    }
                  }}
                  disabled={!isAvailable || !isCurrentMonth}
                  className={`h-8 rounded-full text-sm flex items-center justify-center ${
                    getDayClass(day, isCurrentMonth, isSelected)
                  }`}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

          {/* Detalle de reservas para el día seleccionado */}
          {selectedDate && (
            <div className="mt-4 p-3 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">
                  {format(selectedDate, "EEEE d MMMM", { locale: es })}
                </h4>
                
                {availabilityData && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const availability = availabilityData.find(avail => 
                          isSameDay(parseISO(avail.date_all), selectedDate)
                        );
                        if (availability) {
                          openEditModal(availability);
                        }
                      }}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                    >
                      Editar horario
                    </button>
                    <button
                      onClick={() => {
                        const availability = availabilityData.find(avail => 
                          isSameDay(parseISO(avail.date_all), selectedDate)
                        );
                        if (availability) {
                          handleDeleteAvailability(availability.id);
                        }
                      }}
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
            </div>
          )}
        </div>
      )}

      {/* Modal de edición de disponibilidad */}
      {isEditModalOpen && availabilityToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <FormEditAvailibilty
              id={availabilityToEdit.id}
              start_time={availabilityToEdit.start_time}
              end_time={availabilityToEdit.end_time}
              onClose={closeEditModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlCoworking;