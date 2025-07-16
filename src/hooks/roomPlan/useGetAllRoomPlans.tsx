import apiSijac from "@/api/sijac";
import { useQuery } from "@tanstack/react-query";

 export interface RoomPlan {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  cellphone: string;
  tuition: string;
  available_hours: number;
}

const fetchAllRoomPlans = async (): Promise<RoomPlan[]> => {
  const { data } = await apiSijac.get<RoomPlan[]>("/room_plan/get_all");
  return data;
};

export function useGetAllRoomPlans() {
  const { data, isLoading, error } = useQuery<RoomPlan[]>({
    queryKey: ['roomPlans'], // Key sin parámetros
    queryFn: fetchAllRoomPlans,
    staleTime: Infinity,
  });

  return {
    roomPlans: data,
    isLoading,
    error
  };
}