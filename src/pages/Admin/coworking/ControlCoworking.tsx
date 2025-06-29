import { useAvaliabilityRoomsByRoomId } from "@/hooks/availabilityRoom/useAvaliabilityRoomsByRoomId";
import { useGetAllRooms } from "@/hooks/room/useGetAllRooms";
import { useRoomAppointmentGetAllByAvailibityId } from "@/hooks/roomAppoinment/useRoomAppointmentGetAllByAvailibityId";
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
} from "date-fns";
import { es } from "date-fns/locale";
import CardControlAppointment from "./CardControlAppointment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiSijac from "@/api/sijac";
import useAuthStore from "@/store/useAuthStore";

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

  const mutation = useMutation({
    mutationFn: updateState,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomAppoinment', selectedAvailabilityId] });
    },
  });

  const handleUpdateState = (ids: string[], newState: UpdateData['newState']) => {
    mutation.mutate({ ids, newState });
  };

  // Función para agrupar citas por group_id
  const groupAppointments = (apps: RoomAppointment[]) => {
    return apps.reduce((acc, app) => {
      const groupKey = app.group_id || 'individual';
      return {
        ...acc,
        [groupKey]: [...(acc[groupKey] || []), app]
      };
    }, {} as Record<string, RoomAppointment[]>);
  };

  // Obtener días con disponibilidad para el mes actual (solo futuros)
  const getAvailableDays = () => {
    if (!availabilityData) return [];

    const daysInMonth = eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    });

    const today = new Date();

    return daysInMonth.filter(
      (day) =>
        isAfter(day, today) && // Solo días futuros
        availabilityData.some((avail) =>
          isSameDay(parseISO(avail.date_all), day)
        )
    );
  };

  // Navegación entre meses limitada a +3 meses
  const prevMonth = () => {
    const prev = addMonths(currentMonth, -1);
    if (prev >= startOfMonth(new Date())) {
      setCurrentMonth(prev);
    }
  };

  const nextMonth = () => {
    const next = addMonths(currentMonth, 1);
    if (next <= addMonths(new Date(), 3)) {
      setCurrentMonth(next);
    }
  };

  // Obtener disponibilidad para un día específico
  const getDayAvailability = (day: Date) => {
    if (!availabilityData) return [];
    return availabilityData.filter((avail) =>
      isSameDay(parseISO(avail.date_all), day)
    );
  };

  if (isLoading) return <div>Cargando salas...</div>;

  // Agrupar citas cuando appointments cambia
  const groupedAppointments = appointments ? groupAppointments(appointments) : {};

  // Opciones de estado disponibles
  const stateOptions: UpdateData['newState'][] = ['pendiente', 'aceptado', 'cancelado', 'reservado', 'nulo'];

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
      {selectedRoomId && availabilityData && (
        <div className="mt-4">
          {/* Controles de navegación */}
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={prevMonth}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              disabled={addMonths(startOfMonth(new Date()), -1) >= currentMonth}
            >
              &larr;
            </button>
            <span className="font-medium">
              {format(currentMonth, "MMMM yyyy", { locale: es })}
            </span>
            <button
              onClick={nextMonth}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              disabled={addMonths(new Date(), 3) <= currentMonth}
            >
              &rarr;
            </button>
          </div>

          {/* Vista de calendario compacto */}
          <div className="grid grid-cols-7 gap-1">
            {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => (
              <div key={i} className="text-center text-xs font-medium py-1">
                {day}
              </div>
            ))}

            {getAvailableDays().map((day, i) => {
              const dayAvailabilities = getDayAvailability(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const hasReservations = dayAvailabilities.some(
                (avail) => avail.disponibility === false
              );

              return (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedDate(day);
                    if (dayAvailabilities[0]?.id) {
                      setSelectedAvailabilityId(dayAvailabilities[0].id);
                    }
                  }}
                  className={`h-8 rounded-full text-sm flex items-center justify-center ${
                    isSelected
                      ? "bg-blue-500 text-white"
                      : hasReservations
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
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
              <h4 className="font-medium mb-2">
                {format(selectedDate, "EEEE d MMMM", { locale: es })}
              </h4>

              {isLoadingAppointments ? (
                <p>Cargando reservas...</p>
              ) : (
                <div className="space-y-4">
                  {appointments && appointments.length > 0 ? (
                    <>
                      {/* Mostrar primero las citas individuales */}
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

                      {/* Mostrar grupos */}
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
                              
                              {/* Botones de acción para el grupo */}
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
    </div>
  );
};

export default ControlCoworking;