import apiSijac from "@/api/sijac";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";

export interface Availability {
  id: string;
  date_all: string; // This is in YYYY-MM-DD format
  start_time: string; // This is in ISO format with timezone
  end_time: string; // This is in ISO format with timezone
  is_null: boolean;
  is_pending: boolean;
  is_reserved: boolean;
  is_acepted: boolean;
  is_rejected: boolean;
  is_cancelled: boolean;
}

const fetchAvaliabilityRoomsByRoomId = async (ctx: QueryFunctionContext) => {
    const [_, id] = ctx.queryKey;
    void _;
    const { data } = await apiSijac.get<Availability[]>(`/room_availability/get_all/${id}`);
    return data;
    
}
export function useAvaliabilityRoomsByRoomId(id:string) {

    const {data, isLoading} = useQuery({
        queryKey: ['availabilityRooms',id],
        queryFn: fetchAvaliabilityRoomsByRoomId,
        staleTime: Infinity,
    })

    return {data, isLoading}

}

