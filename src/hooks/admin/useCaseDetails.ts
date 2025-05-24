import apiSijac from "@/api/sijac";
import useAuthStore from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";

export interface CaseUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  specialty: string;
  url_image: string;
}

export interface CaseClient {
  id: string;
  first_name: string;
  last_name: string;
  dni: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
  owner: boolean;
}

export interface CaseDetails {
  id: string;
  detail: string;
  state: string;
  client: CaseClient;
  created_at: string;
  updated_at: string;
  users: CaseUser[];
}

const fetchCaseDetails = async (caseId: string) => {
    const token = useAuthStore.getState().token;
  const { data } = await apiSijac.get<CaseDetails>(`/case/get/${caseId}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export function useCaseDetails(caseId: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["caseDetails", caseId],
    queryFn: () => fetchCaseDetails(caseId),
    staleTime: Infinity,
    enabled: !!caseId, // Solo se ejecuta si caseId tiene valor
  });

  return { 
    caseDetails: data, 
    isLoading, 
    error, 
    refetchCaseDetails: refetch 
  };
}