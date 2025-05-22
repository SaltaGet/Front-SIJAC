import apiSijac from "@/api/sijac";
import useAuthStore from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  dni: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

const getAllClients = async (): Promise<Client[]> => {
  const token = useAuthStore.getState().token;
  const { data } = await apiSijac.get<Client[]>('/client/get_all', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export function useClientAll() {
  const { data } = useQuery<Client[]>({
    queryKey: ['clients-all-admin'],
    queryFn: getAllClients,
    staleTime: Infinity
  });

  return { data };
}