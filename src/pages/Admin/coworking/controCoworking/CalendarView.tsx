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
import { useAvaliabilityRoomsByRoomId } from "@/hooks/availabilityRoom/useAvaliabilityRoomsByRoomId";
import { Availability } from "@/hooks/availabilityRoom/useAvaliabilityRoomsByRoomId";

interface CalendarViewProps {
  roomId: string;
  selectedDate: Date | null;
  onDateSelect: (date: Date, availabilityId: string) => void;
}

// Mapeo de estados a colores
const STATE_COLORS: Record<string, string> = {
  aceptado: 'rgba(74, 222, 128, 0.7)',    // verde
  pendiente: 'rgba(250, 204, 21, 0.7)',   // amarillo
  reservado: 'rgba(96, 165, 250, 0.7)',  // azul
  cancelado: 'rgba(248, 113, 113, 0.7)',  // rojo
  nulo: 'rgba(209, 213, 219, 0.7)',       // gris
};

const CalendarView = ({ roomId, selectedDate, onDateSelect }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const { data: availabilityData, isLoading } = useAvaliabilityRoomsByRoomId(roomId);

  const getCalendarDays = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start, end });

    const startWeekday = getDay(start);
    const offset = startWeekday === 0 ? 6 : startWeekday - 1;
    
    const previousMonthDays = offset > 0 
      ? eachDayOfInterval({
          start: subDays(start, offset),
          end: subDays(start, 1)
        })
      : [];

    return [...previousMonthDays, ...daysInMonth];
  };

  const getDayAvailability = (day: Date) => {
    if (!availabilityData) return [];
    return availabilityData.filter((avail) =>
      isSameDay(parseISO(avail.date_all), day)
    );
  };

  // Genera el estilo de fondo basado en los estados disponibles
  const getDayBackgroundStyle = (availabilities: Availability[]) => {
    if (availabilities.length === 0) return {};
    
    // Contar la cantidad de cada estado
    const stateCounts = availabilities.reduce((acc, avail) => {
      if (avail.is_acepted) acc.aceptado = (acc.aceptado || 0) + 1;
      if (avail.is_pending) acc.pendiente = (acc.pendiente || 0) + 1;
      if (avail.is_reserved) acc.reservado = (acc.reservado || 0) + 1;
      if (avail.is_cancelled) acc.cancelado = (acc.cancelado || 0) + 1;
      if (avail.is_null) acc.nulo = (acc.nulo || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Obtener estados presentes
    const presentStates = Object.keys(stateCounts).filter(state => stateCounts[state] > 0);
    
    // Si solo hay un estado, usar color sólido
    if (presentStates.length === 1) {
      return { backgroundColor: STATE_COLORS[presentStates[0]] };
    }
    
    // Si hay múltiples estados, crear gradiente
    if (presentStates.length > 1) {
      const total = presentStates.reduce((sum, state) => sum + stateCounts[state], 0);
      const percentages = presentStates.map(state => 
        Math.round((stateCounts[state] / total) * 100)
      );
      
      // Crear stops de gradiente
      const gradientStops = [];
      let accumulated = 0;
      
      for (let i = 0; i < presentStates.length; i++) {
        const state = presentStates[i];
        const percent = percentages[i];
        const start = accumulated;
        const end = start + percent;
        
        gradientStops.push(`${STATE_COLORS[state]} ${start}%`);
        gradientStops.push(`${STATE_COLORS[state]} ${end}%`);
        
        accumulated = end;
      }
      
      return {
        background: `linear-gradient(90deg, ${gradientStops.join(', ')})`
      };
    }
    
    return {};
  };

  // Obtener clase CSS basada en el estado
  const getDayClass = (day: Date, isCurrentMonth: boolean, isSelected: boolean) => {
    if (!isCurrentMonth) return "text-gray-300 bg-white";
    if (isSelected) return "bg-blue-500 text-white";

    const dayAvailabilities = getDayAvailability(day);
    const isPast = !isAfter(day, new Date());

    if (dayAvailabilities.length === 0) {
      return isPast ? "bg-gray-100 text-gray-400" : "bg-white text-gray-800 border border-gray-200";
    }

    // Clase base para días con disponibilidad
    return "text-gray-800";
  };

  const prevMonth = () => setCurrentMonth(addMonths(currentMonth, -1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  if (isLoading) return <p>Cargando disponibilidad...</p>;

  return (
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

      {/* Vista de calendario */}
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
          const backgroundStyle = getDayBackgroundStyle(dayAvailabilities);

          return (
            <button
              key={i}
              onClick={() => {
                if (isAvailable && isCurrentMonth) {
                  onDateSelect(day, dayAvailabilities[0]?.id || "");
                }
              }}
              disabled={!isAvailable || !isCurrentMonth}
              className={`h-8 rounded-full text-sm flex items-center justify-center ${
                getDayClass(day, isCurrentMonth, !!isSelected)
              }`}
              style={isCurrentMonth && !isSelected ? backgroundStyle : {}}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;