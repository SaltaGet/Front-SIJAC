import { useState } from "react";
import { useRoomAppointmentGetAllByAvailibityId } from "@/hooks/roomAppoinment/useRoomAppointmentGetAllByAvailibityId";
import { FormCoworking } from "./FormCoworking"; // Asegúrate de tener la ruta correcta

interface SelectAppointmentProps {
  roomId: string;
}

const SelectAppointment = ({ roomId }: SelectAppointmentProps) => {
  const { data, isLoading } = useRoomAppointmentGetAllByAvailibityId(roomId);
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  const handleSelectAppointment = (id: string) => {
    setSelectedAppointments(prev =>
      prev.includes(id)
        ? prev.filter(appointmentId => appointmentId !== id)
        : [...prev, id]
    );
  };

  const resetAppointments = () => {
    setSelectedAppointments([]);
  }

  const handleSubmit = () => {
    setShowModal(true);
  };

  if (isLoading) return (
    <div className="text-sm text-gray-500 italic">Cargando horarios disponibles...</div>
  );

  const availableAppointments = data?.filter(appointment => appointment.state === "nulo") || [];

  if (availableAppointments.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic py-2">
        No hay horarios disponibles para reservar
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {availableAppointments.map(appointment => (
          <div
            key={appointment.id}
            onClick={() => handleSelectAppointment(appointment.id)}
            className={`
              relative p-3 rounded-lg border cursor-pointer transition-all
              shadow-sm hover:shadow-md
              ${selectedAppointments.includes(appointment.id)
                ? "border-blue-500 bg-blue-50 shadow-blue-100"
                : "border-gray-200 bg-white hover:border-gray-300"}
            `}
          >
            <div className={`absolute top-2 right-2 w-2 h-2 rounded-full 
              ${selectedAppointments.includes(appointment.id) 
                ? "bg-blue-500" 
                : "bg-gray-300"}`}
            />
            <div className="text-center">
              <span className={`text-lg font-medium tracking-tight
                ${selectedAppointments.includes(appointment.id)
                  ? "text-blue-600"
                  : "text-gray-700"}`}
              >
                {appointment.start_time.substring(0, 5)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedAppointments.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 
            text-white text-sm font-medium rounded-lg shadow-sm
            hover:from-blue-700 hover:to-blue-600 transition-all
            flex items-center gap-2"
          >
            <span>Confirmar reserva</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {selectedAppointments.length}
            </span>
          </button>
        </div>
      )}

      {/* Modal del formulario */}
      {showModal && (
        <FormCoworking
          onClose={() => setShowModal(false)}
          selectedAppointments={selectedAppointments}
          roomId={roomId}
          resetAppointments={resetAppointments}
        />
      )}
    </div>
  );
};

export default SelectAppointment;