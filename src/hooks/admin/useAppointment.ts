import apiSijac from "@/api/sijac";
import useAuthStore from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query"
export interface Apointment {
    id: string;
    date_get: string;
    start_time: string;
    end_time: string;
    full_name?: string;
    email?: string;
    cellphone?:string;
    reason?: string;
    state: string;
    user_id: string;
    availability_id: string;
  }

const fetchApointments = async () => {
    const token = useAuthStore.getState().token
    const {data} = await apiSijac.get<Apointment[]>(`/appointment/get_all`,{
      headers: {
        Authorization : `Bearer ${token}`
      }
    })

    return data
}
export function useAppointment() {
    const {data: appointmentsData, refetch: refetchAppointments } = useQuery({
        queryKey: ["appointments-admin"],
        queryFn: fetchApointments,
        staleTime: Infinity,
      })

    return {appointmentsData,refetchAppointments}

}