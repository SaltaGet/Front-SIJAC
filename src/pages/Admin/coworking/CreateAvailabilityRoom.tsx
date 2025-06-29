import apiSijac from "@/api/sijac";
import { useAvaliabilityRoomsByRoomId } from "@/hooks/availabilityRoom/useAvaliabilityRoomsByRoomId";
import useAuthStore from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface AvailabilityDate {
  date_all: string;
  start_time: string;
  end_time: string;
  room_id: string;
}

interface CreateAvailabilityRoomProps {
  roomId: string;
  roomName: string;
  onCloseModal?: () => void;
  onSave?: (availabilityDates: AvailabilityDate[]) => void;
}

const postAllRoomAvailabilities = async (dates: AvailabilityDate[]) => {
  const token = useAuthStore.getState().token;
  
  const requests = dates.map(date => 
    apiSijac.post('/room_availability/create', date, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
  );

  const responses = await Promise.all(requests);
  return responses.map(res => res.data);
};

const CreateAvailabilityRoom: React.FC<CreateAvailabilityRoomProps> = ({
  roomId,
  onCloseModal,
  onSave,
  roomName
}) => {
  const [availabilityDates, setAvailabilityDates] = useState<AvailabilityDate[]>([]);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtener disponibilidades existentes
  const { data: existingAvailabilities, isLoading: isLoadingAvailabilities } = 
    useAvaliabilityRoomsByRoomId(roomId);

  const { mutateAsync } = useMutation({
    mutationFn: postAllRoomAvailabilities,
    onSuccess: () => {
      alert("Todas las fechas se guardaron correctamente");
      onCloseModal?.();
    },
    onError: () => {
      alert("Algunas fechas no se pudieron guardar. Por favor verifica e intenta nuevamente");
    }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalizar a inicio de día
  const startMonth = new Date();
  startMonth.setMonth(today.getMonth());
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 3);

  // Función para verificar si una fecha está deshabilitada
  const isDisabledDate = (date: Date): boolean => {
    date.setHours(0, 0, 0, 0); // Normalizar a inicio de día
    
    // Verificar si es anterior al día actual
    const isPastDate = date < today;
    
    // Verificar si es fin de semana
    const day = date.getDay();
    const isWeekend = day === 0 || day === 6;
    
    // Verificar si ya está marcado como disponible
    const dateString = date.toISOString().split('T')[0];
    const isAlreadyAvailable = existingAvailabilities?.some(
      avail => avail.date_all === dateString && avail.disponibility
    ) ?? false;
    
    return isPastDate || isWeekend || isAlreadyAvailable;
  };

  // Fechas ya existentes para deshabilitar en el calendario
  const disabledDates = useMemo(() => {
    if (!existingAvailabilities) return [];
    
    return existingAvailabilities
      .filter(avail => avail.disponibility)
      .map(avail => {
        return new Date(avail.date_all + 'T00:00:00');
      });
  }, [existingAvailabilities]);

  const handleDayClick = (day: Date) => {
    day.setHours(0, 0, 0, 0); // Normalizar a inicio de día
    
    if (isDisabledDate(day)) {
      return;
    }

    const dateString = day.toISOString().split("T")[0];
    const currentDates = [...availabilityDates];

    const dateIndex = currentDates.findIndex((d) => d.date_all === dateString);

    if (dateIndex === -1) {
      currentDates.push({ 
        date_all: dateString, 
        start_time: `${startTime}:00.000Z`, 
        end_time: `${endTime}:00.000Z`,
        room_id: roomId 
      });
    } else {
      currentDates.splice(dateIndex, 1);
    }

    setAvailabilityDates(currentDates);
  };

  const generateStartTimeOptions = () => {
    const options = [];
    const endHour = parseInt(endTime.split(':')[0]);
    
    for (let hour = 8; hour <= 21; hour++) {
      if (hour < endHour) {
        options.push(
          <option key={`start-${hour}`} value={`${hour.toString().padStart(2, '0')}:00`}>
            {hour}:00
          </option>
        );
      }
    }
    return options;
  };

  const generateEndTimeOptions = () => {
    const options = [];
    const startHour = parseInt(startTime.split(':')[0]);
    
    for (let hour = 8; hour <= 21; hour++) {
      if (hour > startHour) {
        options.push(
          <option key={`end-${hour}`} value={`${hour.toString().padStart(2, '0')}:00`}>
            {hour}:00
          </option>
        );
      }
    }
    return options;
  };

  const handleTimeChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartTime(value);
      const newStartHour = parseInt(value.split(':')[0]);
      const currentEndHour = parseInt(endTime.split(':')[0]);
      
      if (newStartHour >= currentEndHour) {
        const newEndTime = `${(newStartHour + 1).toString().padStart(2, '0')}:00`;
        setEndTime(newEndTime);
      }
    } else {
      setEndTime(value);
    }

    const updatedDates = availabilityDates.map(date => ({
      ...date,
      start_time: `${type === 'start' ? value : startTime}:00.000Z`,
      end_time: `${type === 'end' ? value : endTime}:00.000Z`
    }));
    setAvailabilityDates(updatedDates);
  };

  const selectedDateObjects = availabilityDates.map((d) => {
    const date = new Date(d.date_all);
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await mutateAsync(availabilityDates);
      if (onSave) {
        onSave(availabilityDates);
      }
    } catch (error) {
      console.error("Error al guardar disponibilidad:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingAvailabilities) {
    return (
      <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow">
        <div className="flex justify-center items-center h-40">
          <p>Cargando disponibilidades existentes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Disponibilidad - Oficina: {roomName}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex items-center justify-end">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {availabilityDates.length} {availabilityDates.length === 1 ? "fecha" : "fechas"} seleccionadas
          </span>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
              Hora de inicio
            </label>
            <select
              id="startTime"
              value={startTime}
              onChange={(e) => handleTimeChange('start', e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {generateStartTimeOptions()}
            </select>
          </div>
          
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
              Hora de fin
            </label>
            <select
              id="endTime"
              value={endTime}
              onChange={(e) => handleTimeChange('end', e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {generateEndTimeOptions()}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <DayPicker
            mode="multiple"
            selected={selectedDateObjects}
            startMonth={startMonth}
            endMonth={nextMonth}
            onDayClick={handleDayClick}
            modifiers={{
              disabled: isDisabledDate,
              alreadyBooked: disabledDates,
              past: { before: today },
            }}
            modifiersClassNames={{
              selected: "bg-blue-500 text-white rounded-full",
              disabled: "text-gray-300 cursor-not-allowed",
              alreadyBooked: "bg-red-100 text-red-500 line-through",
              past: "bg-gray-100 text-gray-400 line-through",
              today: "border border-blue-500",
            }}
            modifiersStyles={{
              alreadyBooked: { border: "1px dashed red" },
              past: { border: "1px dashed gray" },
            }}
            styles={{
              day: {
                transition: "all 0.2s ease-in-out",
                margin: "0.2rem",
                width: "2rem",
                height: "2rem",
              },
              month: {
                width: "100%",
              },
            }}
            className="border rounded-lg p-3"
          />
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
              <span>Seleccionado</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-100 border border-red-300 rounded-full mr-1"></div>
              <span>Ocupado</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-full mr-1"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-100 border border-gray-300 line-through rounded-full mr-1"></div>
              <span>Pasado/Fin semana</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex-1 transition-colors"
            disabled={availabilityDates.length === 0 || isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar Disponibilidad"}
          </button>

          {onCloseModal && (
            <button
              type="button"
              onClick={onCloseModal}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md flex-1 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateAvailabilityRoom;