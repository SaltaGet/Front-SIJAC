import apiSijac from "@/api/sijac";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query"
export interface ApointmentData {
    id: string;
    user_id: string;
    date_all: string;
    appointments: AppointmentClient[];
  }
  
  export interface AppointmentClient {
    id: string;
    date_get: string;
    start_time: string;
    state: string;
  }

const fetchApointments = async (ctx:QueryFunctionContext) => {
    const [_, id, avId] = ctx.queryKey;
    void _
    const {data} = await apiSijac.get<ApointmentData>(`/availability/get/${avId}?user_id=${id}`,)

    return data
}
export function useAppointmentClient(userId?: string, availabilityId?: string) {
    const {data: appointmentsData, refetch: refetchAppointments } = useQuery({
        queryKey: ["appointmentsClient",userId,availabilityId],
        queryFn: fetchApointments,
        staleTime: Infinity,
        enabled: Boolean(userId && availabilityId)

      })

    return {appointmentsData,refetchAppointments}

}