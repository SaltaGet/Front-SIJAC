import apiSijac from "@/api/sijac";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";

interface Appointment {
  id: string;
  date_get: string; // Formato YYYY-MM-DD
  start_time: string; // Formato ISO (HH:MM:SS.SSSZ)
  state: string; // Ejemplo: "cancelado"
  group_id: string;
}

interface RoomPlanDetails {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  cellphone: string;
  tuition: string;
  available_hours: number;
  appointments: Appointment[];
}

const fetchRoomPlanById = async (ctx: QueryFunctionContext): Promise<RoomPlanDetails> => {
  const [_, roomPlanId] = ctx.queryKey;
  void _;
  const { data } = await apiSijac.get<RoomPlanDetails>(`/room_plan/get/${roomPlanId}`);
  return data;
};

export function useGetRoomPlanById(roomPlanId: string) {
  const { data, isLoading, error, isError } = useQuery<RoomPlanDetails>({
    queryKey: ['roomPlanDetails', roomPlanId],
    queryFn: fetchRoomPlanById,
    staleTime: 1000 * 60 * 5, // 5 minutos de stale time
  });

  return {
    roomPlan: data,
    isLoading,
    error,
    isError
  };
}