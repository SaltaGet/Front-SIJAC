import apiSijac from "@/api/sijac";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";

interface RoomAppointment {
  id: string;
  date_get: string;
  start_time: string; // Formato HH:MM:SS
  state: string; // Posibles valores: "nulo", "cancelado", etc.
  group_id: string | null;
}

const fetchRoomAppointment = async (ctx: QueryFunctionContext): Promise<RoomAppointment[]> => {
  const [_, id] = ctx.queryKey;
  void _;
  const { data } = await apiSijac.get<RoomAppointment[]>(`/room_appointment/get_all/${id}`);
  return data;
};

export function useRoomAppointmentGetAllByAvailibityId(id: string) {
  const { data, isLoading } = useQuery<RoomAppointment[]>({
    queryKey: ['roomAppointment', id],
    queryFn: fetchRoomAppointment,
    staleTime: Infinity,
  });

  return {
    data,
    isLoading
  };
}

/* Ejemplo actualizado para reflejar la respuesta real:
[
  {
    "id": "9634247f-010b-4b38-ae9e-fb897ba32353",
    "date_get": "2025-07-01",
    "start_time": "08:00:00",
    "state": "nulo",
    "group_id": null
  }
]
*/