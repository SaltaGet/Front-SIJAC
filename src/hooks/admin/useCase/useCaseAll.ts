import apiSijac from "@/api/sijac";
import useAuthStore from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";

export interface Case {
  id: string;
  detail: string;
  state: string;
  client: {
    id: string;
    first_name: string;
    last_name: string;
  };
  created_at: string;
  updated_at: string;
  owner: boolean;
}

const getAllCases = async (): Promise<Case[]> => {
  const token = useAuthStore.getState().token;
  const { data } = await apiSijac.get<Case[]>('/case/get_all', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export function useCaseAll() {
  const { data } = useQuery<Case[]>({
    queryKey: ['cases-all-admin'],
    queryFn: getAllCases,
    staleTime: Infinity
  });

  return { data };
}