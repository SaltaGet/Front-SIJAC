import { useAvailability } from "@/hooks/useAvailability";
import useAuthStore from "@/store/useAuthStore";
import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const generateTimeOptions = () => {
  const options = [];
  for (let h = 9; h <= 20; h++) {
    const hour = h.toString().padStart(2, "0");
    options.push(`${hour}:00`);
  }
  return options;
};

const timeOptions = generateTimeOptions();

const CalendarSelector = () => {
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [availableDays, setAvailableDays] = useState<Date[]>([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("16:00");
  const [autoFill, setAutoFill] = useState(false);
  const { userId } = useAuthStore();
  const { createAvailability, takenDays, isPendingCreate } = useAvailability(
    userId ?? undefined
  );

  const today = new Date();

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();

    const days: Date[] = [];

    for (let i = 1; i <= lastDay; i++) {
      const date = new Date(year, month, i);
      if (date > now && date.getDay() !== 0 && date.getDay() !== 6) {
        days.push(date);
      }
    }

    setAvailableDays(days);
  }, []);

  const handleDayClick = (day: Date) => {
    if (autoFill) return;

    if (day.getDay() === 0 || day.getDay() === 6 || day <= today) return;

    const exists = selectedDays.some(
      (d) => d.toDateString() === day.toDateString()
    );

    if (exists) {
      setSelectedDays(
        selectedDays.filter((d) => d.toDateString() !== day.toDateString())
      );
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const formatToArgentinaTime = (date: Date): string => {
    const dateInArgentina = new Date(date.getTime() - 3 * 60 * 60 * 1000);

    const hour = dateInArgentina.getUTCHours().toString().padStart(2, "0");
    const minute = dateInArgentina.getUTCMinutes().toString().padStart(2, "0");
    const second = dateInArgentina.getUTCSeconds().toString().padStart(2, "0");
    const ms = dateInArgentina.getUTCMilliseconds().toString().padStart(3, "0");

    return `${hour}:${minute}:${second}.${ms}Z`;
  };

  const handleConfirm = () => {
    const daysToUse = autoFill
      ? availableDays.filter(
          (date) => !takenDays.includes(date.toISOString().split("T")[0])
        )
      : selectedDays;

    const result = daysToUse.map((date) => {
      const dateStr = date.toISOString().split("T")[0];

      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      const start = new Date(date);
      start.setHours(startHour, startMinute, 0, 0);

      const end = new Date(date);
      end.setHours(endHour, endMinute, 0, 0);

      return {
        date_all: dateStr,
        start_time: formatToArgentinaTime(start),
        end_time: formatToArgentinaTime(end),
      };
    });

    createAvailability(result);
    setSelectedDays([]);
  };

  const validStartOptions = timeOptions.filter((t) => t < endTime);
  const validEndOptions = timeOptions.filter((t) => t > startTime);

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
          disabled={(date) => {
            const isWeekendOrPast =
              date.getDay() === 0 || date.getDay() === 6 || date <= today;
            const isTaken = takenDays.includes(
              date.toISOString().split("T")[0]
            );
            return isWeekendOrPast || isTaken;
          }}
          startMonth={new Date(today.getFullYear(), today.getMonth(), 1)}
          endMonth={new Date(today.getFullYear(), today.getMonth() + 1, 1)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={autoFill}
          onChange={(e) => setAutoFill(e.target.checked)}
        />
        Disponible todo el mes
      </label>

      <div className="flex justify-between gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Hora desde</label>
          <select
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {validStartOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Hora hasta</label>
          <select
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {validEndOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleConfirm}
        disabled={isPendingCreate}
        className="w-full bg-prim-500 hover:bg-prim-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPendingCreate ? "Creando..." : "Crear Turnos Disponibles"}
      </button>
    </div>
  );
};

export default CalendarSelector;
