import { useState, useEffect, useMemo, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useAvailability } from "@/hooks/useAvailability";
import useAuthStore from "@/store/useAuthStore";

const WORKING_HOURS = {
  START: 9,
  END: 20,
  DAY_START: "09:00",
  DAY_END: "16:00",
  DAY_START_OPTIONAL: null,
  DAY_END_OPTIONAL: null,
};

const WEEKEND_DAYS = [0, 6]; // Domingo (0) y Sábado (6)

const generateTimeOptions = () => {
  return Array.from({ length: WORKING_HOURS.END - WORKING_HOURS.START + 1 }, (_, i) => {
    const hour = (WORKING_HOURS.START + i).toString().padStart(2, "0");
    return `${hour}:00`;
  });
};

const formatToArgentinaTime = (date: Date): string => {
  const dateInArgentina = new Date(date.getTime() - 3 * 60 * 60 * 1000);
  const hour = dateInArgentina.getUTCHours().toString().padStart(2, "0");
  const minute = dateInArgentina.getUTCMinutes().toString().padStart(2, "0");
  const second = dateInArgentina.getUTCSeconds().toString().padStart(2, "0");
  const ms = dateInArgentina.getUTCMilliseconds().toString().padStart(3, "0");

  return `${hour}:${minute}:${second}.${ms}Z`;
};

const CalendarSelector = () => {
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [availableDays, setAvailableDays] = useState<Date[]>([]);
  const [startTime, setStartTime] = useState(WORKING_HOURS.DAY_START);
  const [endTime, setEndTime] = useState(WORKING_HOURS.DAY_END);
  const [startTimeOptional, setStartTimeOptional] = useState<string | null>(WORKING_HOURS.DAY_START_OPTIONAL);
  const [endTimeOptional, setEndTimeOptional] = useState<string | null>(WORKING_HOURS.DAY_END_OPTIONAL);
  const [autoFill, setAutoFill] = useState(false);
  
  const { userId } = useAuthStore();
  const { createAvailability, takenDays, isPendingCreate } = useAvailability(userId ?? undefined);

  const today = useMemo(() => new Date(), []);
  const timeOptions = useMemo(generateTimeOptions, []);
  
  const validStartOptions = useMemo(
    () => timeOptions.filter((t) => t < endTime),
    [timeOptions, endTime]
  );
  
  const validEndOptions = useMemo(
    () => timeOptions.filter((t) => t > startTime),
    [timeOptions, startTime]
  );

// Options for optional start time (must be > endTime)
const validStartOptionalOptions = useMemo(
  () => {
    return timeOptions.filter(t => t > endTime);
  },
  [timeOptions, endTime]
);

// Options for optional end time (must be > startTimeOptional)
const validEndOptionalOptions = useMemo(
  () => {
    if (!startTimeOptional) return [];
    return timeOptions.filter(t => t > startTimeOptional);
  },
  [timeOptions, startTimeOptional]
);

  useEffect(() => {
    const generateAvailableDays = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const lastDay = new Date(year, month + 1, 0).getDate();

      const days: Date[] = [];

      for (let day = 1; day <= lastDay; day++) {
        const date = new Date(year, month, day);
        const isWeekday = !WEEKEND_DAYS.includes(date.getDay());
        const isFutureDate = date > now;
        
        if (isWeekday && isFutureDate) {
          days.push(date);
        }
      }

      return days;
    };

    setAvailableDays(generateAvailableDays());
  }, []);

  const handleDayClick = useCallback((day: Date) => {
    if (autoFill) return;
    
    const isInvalidDay = WEEKEND_DAYS.includes(day.getDay()) || day <= today;
    if (isInvalidDay) return;

    setSelectedDays(prevSelectedDays => {
      const dayExists = prevSelectedDays.some(d => d.toDateString() === day.toDateString());
      
      return dayExists
        ? prevSelectedDays.filter(d => d.toDateString() !== day.toDateString())
        : [...prevSelectedDays, day];
    });
  }, [autoFill, today]);

  const handleStartTimeOptionalChange = useCallback((value: string | null) => {
    setStartTimeOptional(value);
    // Reset endTimeOptional if it's invalid with the new startTimeOptional
    if (value && endTimeOptional && endTimeOptional <= value) {
      setEndTimeOptional(null);
    }
  }, [endTimeOptional]);

  const handleEndTimeOptionalChange = useCallback((value: string | null) => {
    setEndTimeOptional(value);
  }, []);

  const handleConfirm = useCallback(() => {
    const daysToUse = autoFill
      ? availableDays.filter(
          date => !takenDays.includes(date.toISOString().split("T")[0])
        )
      : selectedDays;
  
    const availabilityData = daysToUse.map(date => {
      const dateStr = date.toISOString().split("T")[0];
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);
  
      const start = new Date(date);
      start.setHours(startHour, startMinute, 0, 0);
  
      const end = new Date(date);
      end.setHours(endHour, endMinute, 0, 0);
  
      // Formatear los tiempos opcionales si existen
      let formattedStartOptional = null;
      let formattedEndOptional = null;
  
      if (startTimeOptional) {
        const [startOptHour, startOptMinute] = startTimeOptional.split(":").map(Number);
        const startOpt = new Date(date);
        startOpt.setHours(startOptHour, startOptMinute, 0, 0);
        formattedStartOptional = formatToArgentinaTime(startOpt);
      }
  
      if (endTimeOptional) {
        const [endOptHour, endOptMinute] = endTimeOptional.split(":").map(Number);
        const endOpt = new Date(date);
        endOpt.setHours(endOptHour, endOptMinute, 0, 0);
        formattedEndOptional = formatToArgentinaTime(endOpt);
      }
  
      return {
        date_all: dateStr,
        start_time: formatToArgentinaTime(start),
        end_time: formatToArgentinaTime(end),
        start_time_optional: formattedStartOptional,
        end_time_optional: formattedEndOptional,
      };
    });
  
    createAvailability(availabilityData);
    setSelectedDays([]);
  }, [autoFill, availableDays, takenDays, selectedDays, startTime, endTime, createAvailability, startTimeOptional, endTimeOptional]);

  const isDayDisabled = useCallback((date: Date) => {
    const isWeekendOrPast = WEEKEND_DAYS.includes(date.getDay()) || date <= today;
    const isTaken = takenDays.includes(date.toISOString().split("T")[0]);
    return isWeekendOrPast || isTaken;
  }, [today, takenDays]);

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <div className={autoFill ? "pointer-events-none opacity-50" : ""}>
        <DayPicker
          mode="multiple"
          selected={selectedDays}
          onDayClick={handleDayClick}
          modifiersClassNames={{
            selected: "bg-prim-500 text-white",
            disabled: "text-gray-400 line-through",
          }}
          disabled={isDayDisabled}
          startMonth={new Date(today.getFullYear(), today.getMonth(), 1)}
          endMonth={new Date(today.getFullYear(), today.getMonth() + 1, 1)}
        />
      </div>

      <div className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={autoFill}
          onChange={(e) => setAutoFill(e.target.checked)}
          className="rounded text-prim-500 focus:ring-prim-500"
        />
        Disponible todo el mes
      </div>

      <div className="flex justify-between gap-4">
        <TimeSelect
          label="Hora desde"
          value={startTime}
          options={validStartOptions}
          onChange={setStartTime}
        />
        <TimeSelect
          label="Hora hasta"
          value={endTime}
          options={validEndOptions}
          onChange={setEndTime}
        />
      </div>

      <div className="flex justify-between gap-4">
        <TimeSelectOptional
          label="Hora opcional desde"
          value={startTimeOptional}
          options={validStartOptionalOptions}
          onChange={handleStartTimeOptionalChange}
        />
        <TimeSelectOptional
          label="Hora opcional hasta"
          value={endTimeOptional}
          options={validEndOptionalOptions}
          onChange={handleEndTimeOptionalChange}
          disabled={!startTimeOptional}
        />
      </div>

      <button
        onClick={handleConfirm}
        disabled={isPendingCreate}
        className="w-full bg-prim-500 hover:bg-prim-600 text-white px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPendingCreate ? "Creando..." : "Crear Turnos Disponibles"}
      </button>
    </div>
  );
};

interface TimeSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const TimeSelect = ({ label, value, options, onChange }: TimeSelectProps) => (
  <div className="flex flex-col flex-1">
    <label className="text-sm font-medium mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-2 py-1 focus:ring-prim-500 focus:border-prim-500"
    >
      {options.map((time) => (
        <option key={time} value={time}>
          {time}
        </option>
      ))}
    </select>
  </div>
);

interface TimeSelectOptionalProps {
  label: string;
  value: string | null;
  options: string[];
  onChange: (value: string | null) => void;
  disabled?: boolean;
}

const TimeSelectOptional = ({ label, value, options, onChange, disabled = false }: TimeSelectOptionalProps) => (
  <div className="flex flex-col flex-1">
    <label className="text-sm font-medium mb-1">{label}</label>
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value || null)}
      disabled={disabled}
      className={`border rounded px-2 py-1 focus:ring-prim-500 focus:border-prim-500 ${disabled ? "bg-gray-100" : ""}`}
    >
      <option value="">No especificado</option>
      {options.map((time) => (
        <option key={time} value={time}>
          {time}
        </option>
      ))}
    </select>
  </div>
);

export default CalendarSelector;