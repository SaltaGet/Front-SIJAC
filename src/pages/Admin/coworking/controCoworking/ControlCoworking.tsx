import { useState } from "react";
import { useGetAllRooms } from "@/hooks/room/useGetAllRooms";
import AppointmentsView from "./AppointmentsView";
import CalendarView from "./CalendarView";

type Room = {
  id: string;
  name: string;
  type_room: string;
  description: string;
  price: number;
  url_image: string[];
  created_at: string;
};

const ControlCoworking = () => {
  const { rooms, isLoading } = useGetAllRooms();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<string | null>(null);

  if (isLoading) return <div>Cargando salas...</div>;

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

      {selectedRoomId && (
        <CalendarView
          roomId={selectedRoomId}
          selectedDate={selectedDate}
          onDateSelect={(date, availabilityId) => {
            setSelectedDate(date);
            setSelectedAvailabilityId(availabilityId);
          }}
        />
      )}

      {selectedDate && selectedAvailabilityId && (
        <AppointmentsView 
          availabilityId={selectedAvailabilityId} 
          selectedDate={selectedDate}
          roomId={selectedRoomId || ""}
        />
      )}
    </div>
  );
};

export default ControlCoworking;