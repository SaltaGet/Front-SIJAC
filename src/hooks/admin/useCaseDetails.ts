import apiSijac from "@/api/sijac";
import useAuthStore from "@/store/useAuthStore";
import { QueryFunctionContext, useQuery, useQueryClient } from "@tanstack/react-query";

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
  
}

export interface CaseDetails {
  id: string;
  detail: string;
  state: string;
  client: CaseClient;
  created_at: string;
  updated_at: string;
  users: CaseUser[];
  owner: boolean;
}

const fetchCaseDetails = async (ctx: QueryFunctionContext) => {
    const [_, caseId] = ctx.queryKey;
    void _;
    const token = useAuthStore.getState().token;
  const { data } = await apiSijac.get<CaseDetails>(`/case/get/${caseId}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export function useCaseDetails(caseId: string) {
    const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["caseDetails", caseId],
    queryFn: fetchCaseDetails,
    staleTime: Infinity,
    enabled: !!caseId, // Solo se ejecuta si caseId tiene valor
  });

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["caseDetails", caseId] });
  };

 

  return { 
    caseDetails: data, 
    isLoading, 
    error, 
    refetchCaseDetails: refetch 
  };
}