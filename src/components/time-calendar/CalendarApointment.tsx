import { Apointment, useAppointment } from "@/hooks/admin/useAppointment";
import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { FaWhatsapp } from "react-icons/fa";

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<Apointment | null>(null);
  const [eventStatusFilter, setEventStatusFilter] = useState<
    "pendiente" | "aceptado" | "cancelado"
  >("pendiente");
  const { appointmentsData: events } = useAppointment();

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setEventStatusFilter(
      e.target.value as "pendiente" | "aceptado" | "cancelado"
    );
    setSelectedEvent(null); // limpiar evento seleccionado al cambiar filtro
  };

  const compareDates = (date1: Date, date2: string) =>
    date1.toISOString().split("T")[0] === date2;

  const filteredEvents = events
    ? events.filter(
        (event) =>
          selectedDate &&
          compareDates(selectedDate, event.date_get) &&
          event.state === eventStatusFilter
      )
    : [];

  const eventDates = new Set(events?.map((e) => e.date_get));

  const handleEventSelect = (event: Apointment) => {
    setSelectedEvent(event);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <DayPicker
        selected={selectedDate}
        onDayClick={handleDateChange}
        disabled={(date) => !eventDates.has(date.toISOString().split("T")[0])}
        modifiersClassNames={{
          disabled: "text-gray-400 line-through",
        }}
      />

      <div>
        <label className="block mb-1 text-sm font-medium">
          Filtrar por estado:
        </label>
        <select
          value={eventStatusFilter}
          onChange={handleStatusFilterChange}
          className="border border-gray-300 rounded px-3 py-1 text-sm"
        >
          <option value="pendiente">Pendientes</option>
          <option value="aceptado">Aceptados</option>
          <option value="cancelado">Cancelados</option>
        </select>
      </div>

      {selectedDate && filteredEvents.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            Turnos para {selectedDate.toLocaleDateString()}:
          </h3>
          <div className="flex flex-wrap gap-2">
            {filteredEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => handleEventSelect(event)}
                className={`p-2 rounded-lg border text-sm font-medium transition ${
                  selectedEvent?.id === event.id
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black hover:bg-blue-100"
                }`}
              >
                {event.start_time.slice(0, 5)}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 italic">
          No hay turnos para esta fecha con el estado seleccionado.
        </p>
      )}

      {selectedEvent && (
        <div className="p-4 border rounded-xl bg-gray-50 shadow space-y-2">
          <h3 className="text-lg font-bold text-blue-600 mb-2">
            Detalles del turno seleccionado
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <p>
              <strong>ID:</strong> {selectedEvent.id}
            </p>
            <p>
              <strong>Fecha:</strong> {selectedEvent.date_get}
            </p>
            <p>
              <strong>Inicio:</strong> {selectedEvent.start_time}
            </p>
            <p>
              <strong>Fin:</strong> {selectedEvent.end_time}
            </p>
            <p>
              <strong>Razón:</strong> {selectedEvent.reason || "No disponible"}
            </p>
            <p>
              <strong>Nombre:</strong>{" "}
              {selectedEvent.full_name || "No disponible"}
            </p>
            <p>
              <strong>Email:</strong> {selectedEvent.email || "No disponible"}
            </p>
            <p>
              <strong>Teléfono:</strong>{" "}
              {selectedEvent.cellphone || "No disponible"}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              <span
                className={`font-semibold ${
                  selectedEvent.state === "pendiente"
                    ? "text-yellow-600"
                    : selectedEvent.state === "aceptado"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {selectedEvent.state}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
              Aceptar
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
              Rechazar
            </button>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              onClick={() => setSelectedEvent(null)}
            >
              Cerrar
            </button>

            {selectedEvent.cellphone && (
              <a
                href={`https://wa.me/${selectedEvent.cellphone.replace(
                  /\D/g,
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                <FaWhatsapp size={20} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
