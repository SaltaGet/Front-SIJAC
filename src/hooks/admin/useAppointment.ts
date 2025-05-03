import apiSijac from "@/api/sijac";
import useAuthStore from "@/store/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Tipado de turnos
export interface Appointment {
  id: string;
  date_get: string;
  start_time: string;
  end_time: string;
  full_name?: string;
  email?: string;
  cellphone?: string;
  reason?: string;
  state: string;
  user_id: string;
  availability_id: string;
}

// Tipado para la actualización de estado
interface UpdateStatusPayload {
  appointmentId: string;
  newState: string;
  reason: string;
}

// Obtener todos los turnos
const fetchAppointments = async (): Promise<Appointment[]> => {
  const token = useAuthStore.getState().token;

  const { data } = await apiSijac.get<Appointment[]>("/appointment/get_all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

// Actualizar estado de un turno
const putUpdateStatus = async (payload: UpdateStatusPayload) => {
  const token = useAuthStore.getState().token;
  const { appointmentId, newState, reason } = payload;

  const { data } = await apiSijac.put(
    `/appointment/update_state/${appointmentId}?new_state=${newState}&reason=${reason}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

// Hook personalizado para turnos
export function useAppointment() {
  const queryClient = useQueryClient();

  const {
    data: appointmentsData,
    refetch: refetchAppointments,
    isRefetching: isLoadingAppointments,
  } = useQuery({
    queryKey: ["appointments-admin"],
    queryFn: fetchAppointments,
    staleTime: Infinity,
    select: (data) =>
      [...data].sort((a, b) =>
        a.start_time.localeCompare(b.start_time)
      ),
  });

  const {
    mutate,
    isPending: isPendingStatus,
  } = useMutation({
    mutationFn: putUpdateStatus,
    onSuccess: () => {
      console.log("estado actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["appointments-admin"] });
    },
    onError: () => {
      alert("Solo puedes cambiar el estado de un turno con 2 horas de anticipación");
    },
  });

  const updateStatus = (payload: UpdateStatusPayload) => {
    mutate(payload);
  };

  return {
    appointmentsData,
    refetchAppointments,
    updateStatus,
    isPendingStatus,
    isLoadingAppointments
  };
}
