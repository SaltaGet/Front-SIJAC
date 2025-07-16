import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiSijac from "@/api/sijac";
import useAuthStore from "@/store/useAuthStore";
import { useEffect, useState } from "react";

interface FormEditAvailibiltyProps {
  id: string;
  start_time: string; // Formato "08:00:00"
  end_time: string;   // Formato "17:00:00"
  onClose: () => void;
}

const extractTimeFromString = (timeString: string) => {
  if (!timeString) return "08:00";
  return timeString.substring(0, 5);
};

// Generar opciones de hora de 08:00 a 22:00 en intervalos de 1 hora
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 8; hour <= 22; hour++) {
    options.push(`${hour.toString().padStart(2, "0")}:00`);
  }
  return options;
};

export const FormEditAvailibilty = ({
  id,
  start_time,
  end_time,
  onClose,
}: FormEditAvailibiltyProps) => {
  const queryClient = useQueryClient();
  const timeOptions = generateTimeOptions();

  const [selectedStart, setSelectedStart] = useState(() => extractTimeFromString(start_time));
  const [selectedEnd, setSelectedEnd] = useState(() => extractTimeFromString(end_time));
  const [errors, setErrors] = useState<{ start?: string; end?: string }>({});

  useEffect(() => {
    const validateTimes = () => {
      const newErrors: { start?: string; end?: string } = {};

      if (!selectedStart) {
        newErrors.start = "Seleccione una hora de inicio";
      }

      if (!selectedEnd) {
        newErrors.end = "Seleccione una hora de fin";
      }

      if (selectedStart && selectedEnd) {
        const [startHours] = selectedStart.split(':').map(Number);
        const [endHours] = selectedEnd.split(':').map(Number);

        if (startHours > endHours) {
          newErrors.start = "La hora de inicio debe ser anterior a la de fin";
          newErrors.end = "La hora de fin debe ser posterior a la de inicio";
        }

        if ((endHours - startHours) < 1) {
          newErrors.end = "El intervalo mínimo es de 1 hora";
        }
      }

      return newErrors;
    };

    setErrors(validateTimes());
  }, [selectedStart, selectedEnd]);

  const mutation = useMutation({
    mutationFn: async () => {
      const token = useAuthStore.getState().token;
      
      const startTimeFormatted = `${selectedStart}:00`;
      const endTimeFormatted = `${selectedEnd}:00`;
      
      const response = await apiSijac.put(
        `/room_availability/update/${id}`,
        {
          start_time: startTimeFormatted,
          end_time: endTimeFormatted,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availabilityRooms"] });
      queryClient.invalidateQueries({ queryKey: ["roomAppointment"] });
      onClose();
    },
    onError: () => {
      alert("Error al actualizar la disponibilidad verifique que no haya horarios en conflicto");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      mutation.mutate();
    }
  };

  function convertTimeToHours(time: string): number {
    const [hours] = time.split(':').map(Number);
    return hours;
  }

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4 text-gray-800">Editar Horario</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Hora de inicio
          </label>
          <select
            value={selectedStart}
            onChange={(e) => setSelectedStart(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            aria-invalid={!!errors.start}
          >
            {timeOptions.map((time) => (
              <option
                key={`start-${time}`}
                value={time}
                disabled={
                  selectedEnd ? 
                  convertTimeToHours(time) >= convertTimeToHours(selectedEnd) : 
                  false
                }
              >
                {time}
              </option>
            ))}
          </select>
          {errors.start && (
            <p className="text-red-500 text-sm mt-1">{errors.start}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Hora de fin
          </label>
          <select
            value={selectedEnd}
            onChange={(e) => setSelectedEnd(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            aria-invalid={!!errors.end}
          >
            {timeOptions.map((time) => (
              <option
                key={`end-${time}`}
                value={time}
                disabled={
                  selectedStart ? 
                  convertTimeToHours(time) <= convertTimeToHours(selectedStart) : 
                  false
                }
              >
                {time}
              </option>
            ))}
          </select>
          {errors.end && (
            <p className="text-red-500 text-sm mt-1">{errors.end}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
            disabled={mutation.isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={mutation.isPending || Object.keys(errors).length > 0}
            className={`px-4 py-2 rounded text-white transition-colors ${
              mutation.isPending || Object.keys(errors).length > 0
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {mutation.isPending ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};