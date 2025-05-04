import apiSijac from "@/api/sijac";
import { useAvailability } from "@/hooks/useAvailability";
import useAuthStore from "@/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";

interface AdminEditAppointmentProps {
  av_id: string;
}

interface requestData {
  av_id: string;
  start_time: string;
  end_time: string;
  start_time_optional: string | null;
  end_time_optional: string | null;
}

const putAvailability = async (payload: requestData) => {
  const token = useAuthStore.getState().token;
  const { data } = await apiSijac.put(
    `/availability/update/${payload.av_id}`,
    { 
      start_time: payload.start_time, 
      end_time: payload.end_time,
      start_time_optional: payload.start_time_optional,
      end_time_optional: payload.end_time_optional
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

const AdminEditAppointment: React.FC<AdminEditAppointmentProps> = ({
  av_id,
}) => {
  const queryClient = useQueryClient();
  const { userId } = useAuthStore();
  const { availabilityData } = useAvailability(userId ?? undefined);
  const { mutate, isPending } = useMutation({
    mutationFn: putAvailability,
    onSuccess: () => {
      alert("Horario actualizado correctamente");
      queryClient.invalidateQueries({queryKey:["appointments-admin"]});
    },
    onError: () => {
      alert("Error: Verifique que no tenga turnos pendientes e intente nuevamente");
    },
  });
  
  const [filteredData, setFilteredData] = useState(() => 
    availabilityData?.find((data) => data.id === av_id)
  );

  // Actualizar filteredData cuando availabilityData cambie
  useEffect(() => {
    setFilteredData(availabilityData?.find((data) => data.id === av_id));
  }, [availabilityData, av_id]);

  // Extraer y formatear los valores iniciales
  const initialStartTime = filteredData?.start_time || "";
  const initialEndTime = filteredData?.end_time || "";
  const initialStartTimeOptional = filteredData?.start_time_optional ?? null;
  const initialEndTimeOptional = filteredData?.end_time_optional ?? null;

  const hours = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 9;
    const value = hour.toString().padStart(2, "0") + ":00:00";
    const label = hour.toString();
    return { value, label };
  });

  const [startTime, setStartTime] = useState(initialStartTime);
  const [startTimeOptional, setStartTimeOptional] = useState<string | null>(initialStartTimeOptional);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [endTimeOptional, setEndTimeOptional] = useState<string | null>(initialEndTimeOptional);

  // Actualizar estados cuando filteredData cambie
  useEffect(() => {
    setStartTime(filteredData?.start_time || "");
    setEndTime(filteredData?.end_time || "");
    setStartTimeOptional(filteredData?.start_time_optional ?? null);
    setEndTimeOptional(filteredData?.end_time_optional ?? null);
  }, [filteredData]);

  // Validaciones para tiempos principales
  const isEndTimeValid = (time: string) => {
    if (!startTime) return true;
    const startHour = parseInt(startTime.split(":")[0]);
    const endHour = parseInt(time.split(":")[0]);
    return endHour > startHour;
  };

  const isStartTimeValid = (time: string) => {
    if (!endTime) return true;
    const startHour = parseInt(time.split(":")[0]);
    const endHour = parseInt(endTime.split(":")[0]);
    return startHour < endHour;
  };

  // Validaciones para tiempos opcionales
  const isStartTimeOptionalValid = (time: string) => {
    if (!time) return true;
    if (!endTime) return true;
    const optionalStartHour = parseInt(time.split(":")[0]);
    const originalEndHour = parseInt(endTime.split(":")[0]);
    return optionalStartHour > originalEndHour;
  };

  const isEndTimeOptionalValid = (time: string) => {
    if (!time) return true;
    if (!startTimeOptional) return true;
    const optionalEndHour = parseInt(time.split(":")[0]);
    const optionalStartHour = parseInt(startTimeOptional.split(":")[0]);
    return optionalEndHour > optionalStartHour;
  };

  const handleSubmit = async () => {
    // Validación final antes de enviar
    if (!startTime || !endTime) {
      alert("Por favor seleccione ambas horas principales");
      return;
    }

    if (!isEndTimeValid(endTime)) {
      alert("La hora de fin debe ser posterior a la hora de inicio");
      return;
    }

    // Validación para tiempos opcionales
    if (startTimeOptional && !isStartTimeOptionalValid(startTimeOptional)) {
      alert("La hora de inicio opcional debe ser posterior a la hora de fin principal");
      return;
    }

    if (endTimeOptional && !isEndTimeOptionalValid(endTimeOptional)) {
      alert("La hora de fin opcional debe ser posterior a la hora de inicio opcional");
      return;
    }

    if (startTimeOptional && !endTimeOptional) {
      alert("Si define una hora de inicio opcional, debe definir también una hora de fin opcional");
      return;
    }

    if (endTimeOptional && !startTimeOptional) {
      alert("Si define una hora de fin opcional, debe definir también una hora de inicio opcional");
      return;
    }

    mutate({ 
      av_id: av_id, 
      start_time: startTime, 
      end_time: endTime,
      start_time_optional: startTimeOptional,
      end_time_optional: endTimeOptional
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Hora de inicio</label>
        <select
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">Seleccionar hora</option>
          {hours.map(({ value, label }) => (
            <option
              key={value}
              value={value}
              disabled={!isStartTimeValid(value)}
            >
              {label}:00
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Hora de fin</label>
        <select
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">Seleccionar hora</option>
          {hours.map(({ value, label }) => (
            <option key={value} value={value} disabled={!isEndTimeValid(value)}>
              {label}:00
            </option>
          ))}
        </select>
      </div>

      <div className="pt-4 border-t mt-4">
        <h3 className="font-medium mb-2">Segundo Horario (Opcional)</h3>
        
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium">Hora de inicio opcional</label>
          <select
            value={startTimeOptional || ""}
            onChange={(e) => {
              const value = e.target.value || null;
              setStartTimeOptional(value);
              if (!value || (endTimeOptional && !isEndTimeOptionalValid(endTimeOptional))) {
                setEndTimeOptional(null);
              }
            }}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">No especificado</option>
            {hours.map(({ value, label }) => (
              <option
                key={`optional-${value}`}
                value={value}
                disabled={!isStartTimeOptionalValid(value)}
              >
                {label}:00
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Hora de fin opcional</label>
          <select
            value={endTimeOptional || ""}
            onChange={(e) => setEndTimeOptional(e.target.value || null)}
            className="border rounded px-3 py-2 w-full"
            disabled={!startTimeOptional}
          >
            <option value="">{startTimeOptional ? "No especificado" : "Seleccione primero hora de inicio"}</option>
            {hours.map(({ value, label }) => (
              <option
                key={`optional-end-${value}`}
                value={value}
                disabled={!isEndTimeOptionalValid(value)}
              >
                {label}:00
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={
          startTime === "" || 
          endTime === "" || 
          isPending || 
          (startTimeOptional !== null && endTimeOptional === null) || 
          (endTimeOptional !== null && startTimeOptional === null)
        }
        className={`mt-4 px-4 py-2 rounded text-white ${
          !startTime || !endTime || isPending || 
          (startTimeOptional && !endTimeOptional) || 
          (endTimeOptional && !startTimeOptional)
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isPending ? "Guardando..." : "Actualizar Horario"}
      </button>
    </div>
  );
};

export default AdminEditAppointment;