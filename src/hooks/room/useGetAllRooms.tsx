import apiSijac from "@/api/sijac";
import useAuthStore from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";

export interface Room {
  id: string;
  name: string;
  type_room: string;
  description: string;
  price: number;
  url_image: string[];
  created_at: string;
}

const getAllRooms = async (): Promise<Room[]> => {
  const token = useAuthStore.getState().token;
  const { data } = await apiSijac.get('/room/get_all', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return data; // La API devuelve directamente el array de Room
};

export function useGetAllRooms() {
  const { data, isLoading, error, refetch, isRefetching } = useQuery<Room[]>({
    queryKey: ['roomsAll'],
    queryFn: getAllRooms,
    staleTime: 1000 * 60 * 5, // 5 minutos de stale time
  });

  return {
    rooms: data || [], // Ahora data es directamente el array de habitaciones
    isLoading,
    error,
    refetch,
    isRefetching
  };
}