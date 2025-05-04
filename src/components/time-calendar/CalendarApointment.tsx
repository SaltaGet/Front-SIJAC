import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { FaWhatsapp } from "react-icons/fa";
import { Appointment, useAppointment } from "@/hooks/admin/useAppointment";
import { formatearFecha } from "@/util/formatFecha";
import AdminEditAppointment from "@/pages/Admin/AdminEditAppointment";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAvailability } from "@/hooks/useAvailability";
import { Button } from "../ui/button";

const statusColors = {
  nulo: "bg-white text-black hover:bg-blue-100",
  pendiente: "bg-orange-500 text-white",
  aceptado: "bg-green-500 text-white",
  cancelado: "bg-red-500 text-white",
  rechazado: "bg-yellow-500 text-white",
};
const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null);
  const {
    appointmentsData: events,
    updateStatus,
    isPendingStatus,
    isLoadingAppointments,
  } = useAppointment();

  const { mutateDelete, isPendingDelete } = useAvailability();

  // Obtener fechas con eventos pendientes
  const pendingDates = new Set(
    events
      ?.filter((event) => event.state === "pendiente")
      .map((event) => event.date_get)
  );

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
  };

  const filteredEvents =
    events?.filter(
      (event) =>
        selectedDate &&
        event.date_get === selectedDate.toISOString().split("T")[0]
    ) ?? [];

  const eventDates = new Set(events?.map((e) => e.date_get));

  const handleStatusUpdate = (
    newState: string,
    reason = "Pedimos disculpa por el inconveniente ha surgido un inconveniente en este horario y no podremos atenderte"
  ) => {
    if (!selectedEvent) return;
    updateStatus({ appointmentId: selectedEvent.id, newState, reason });
  };

  useEffect(() => {
    if (!selectedEvent) return;

    const updatedEvent = events?.find((e) => e.id === selectedEvent.id);
    if (updatedEvent && updatedEvent !== selectedEvent) {
      setSelectedEvent(updatedEvent);
    }
  }, [events, selectedEvent]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <DayPicker
        selected={selectedDate}
        onDayClick={handleDateChange}
        disabled={(date) => !eventDates.has(date.toISOString().split("T")[0])}
        modifiers={{
          pending: (date) => pendingDates.has(date.toISOString().split("T")[0]),
        }}
        modifiersClassNames={{
          disabled: "text-gray-400 line-through",
          pending: "bg-orange-500 text-white rounded-full",
        }}
      />

      <div className="p-6 max-w-md w-full space-y-4 border rounded-lg shadow bg-white">
        <h2 className="text-lg font-bold">Turnos Aceptados</h2>
        {events &&
          events
            .filter(
              (e: Appointment) =>
                e.state === "aceptado" &&
                new Date(e.date_get) >= new Date(new Date().toDateString())
            )
            .sort((a, b) => a.date_get.localeCompare(b.date_get))
            .map((event: Appointment) => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="block w-full text-left border p-2 rounded hover:bg-blue-50"
              >
                <p className="font-medium">{event.full_name || "Sin nombre"}</p>
                <p className="text-sm text-gray-500">
                  {event.date_get} – {event.start_time.slice(0, 5)}
                </p>
              </button>
            ))}
      </div>

      {selectedDate ? (
        filteredEvents.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">
              Turnos Para el {formatearFecha(new Date(selectedDate))}
            </h3>
            <div className="flex flex-wrap gap-2">
              {filteredEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={`p-2 rounded-lg border text-sm font-medium transition ${
                    statusColors[event.state as keyof typeof statusColors]
                  } ${
                    selectedEvent?.id === event.id ? "ring-2 ring-blue-500" : ""
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
        )
      ) : null}

      {selectedEvent && (
        <div className="p-4 border rounded-xl bg-gray-50 shadow space-y-2">
          <h3 className="text-lg font-bold text-blue-600 mb-2">
            Detalles del turno seleccionado
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {Object.entries({
              ID: selectedEvent.id,
              Fecha: selectedEvent.date_get,
              Inicio: selectedEvent.start_time,
              Fin: selectedEvent.end_time,
              Razón: selectedEvent.reason || "No disponible",
              Nombre: selectedEvent.full_name || "No disponible",
              Email: selectedEvent.email || "No disponible",
              Teléfono: selectedEvent.cellphone || "No disponible",
              Estado: selectedEvent.state,
            }).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong>{" "}
                {key === "Estado" ? (
                  <span
                    className={`font-semibold ${
                      value === "pendiente"
                        ? "text-yellow-600"
                        : value === "aceptado"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {value}
                  </span>
                ) : (
                  value
                )}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            {selectedEvent.state === "pendiente" && (
              <>
                <ActionButton
                  onClick={() => handleStatusUpdate("aceptado")}
                  disabled={isPendingStatus}
                  color="green"
                  label="Aceptar"
                />
                <ActionButton
                  onClick={() => handleStatusUpdate("rechazado")}
                  disabled={isPendingStatus}
                  color="red"
                  label="Rechazar"
                />
              </>
            )}

            {(selectedEvent.state === "pendiente" ||
              selectedEvent.state === "aceptado") && (
              <ActionButton
                onClick={() => handleStatusUpdate("cancelado")}
                disabled={isPendingStatus}
                color="yellow"
                label="Cancelar"
              />
            )}

            <ActionButton
              onClick={() => setSelectedEvent(null)}
              disabled={isPendingStatus}
              color="gray"
              label="Cerrar"
            />

            {selectedEvent?.state !== "rechazado" && !isLoadingAppointments && (
              <ActionButton
                onClick={() => handleStatusUpdate("rechazado")}
                disabled={isPendingStatus}
                color="red"
                label="No disponible"
              />
            )}

            {selectedEvent.cellphone && (
              <WhatsAppButton
                phone={selectedEvent.cellphone}
                disabled={isPendingStatus}
              />
            )}
          </div>
        </div>
      )}

      {filteredEvents.length > 0 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Editar Horarios</AccordionTrigger>
            <AccordionContent>
              <AdminEditAppointment av_id={filteredEvents[0].availability_id} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

{filteredEvents.length > 0 && (
  <Button
    onClick={() => {
      const confirmDelete = window.confirm("¿Estás seguro? y los turnos que estén aceptados y pendientes seran Rechazados automáticamente");
      if (confirmDelete) {
        mutateDelete(filteredEvents[0].availability_id);
      }
    }}
    disabled={isPendingDelete}
  >
    {isPendingDelete ? "Borrando..." : "Borrar Fecha"}
  </Button>
)}

    </div>
  );
};

// Componentes ActionButton y WhatsAppButton permanecen igual
const ActionButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  color: "green" | "red" | "yellow" | "gray";
  label: string;
}> = ({ onClick, disabled, color, label }) => {
  const colors = {
    green: {
      bg: "bg-green-500",
      hover: "hover:bg-green-600",
      disabledBg: "bg-green-300",
    },
    red: {
      bg: "bg-red-500",
      hover: "hover:bg-red-600",
      disabledBg: "bg-red-300",
    },
    yellow: {
      bg: "bg-yellow-500",
      hover: "hover:bg-yellow-600",
      disabledBg: "bg-yellow-300",
    },
    gray: {
      bg: "bg-gray-400",
      hover: "hover:bg-gray-500",
      disabledBg: "bg-gray-300",
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded text-white transition ${
        disabled
          ? `${colors[color].disabledBg} cursor-not-allowed`
          : `${colors[color].bg} ${colors[color].hover}`
      }`}
    >
      {label}
    </button>
  );
};

const WhatsAppButton: React.FC<{ phone: string; disabled: boolean }> = ({
  phone,
  disabled,
}) => (
  <a
    href={`https://wa.me/${phone.replace(/\D/g, "")}`}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex items-center gap-2 px-4 py-2 rounded text-white transition ${
      disabled
        ? "bg-green-300 cursor-not-allowed pointer-events-none"
        : "bg-green-600 hover:bg-green-700"
    }`}
  >
    <FaWhatsapp size={20} />
  </a>
);

export default Calendar;
