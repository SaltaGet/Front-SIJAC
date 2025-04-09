import apiSijac from "@/api/sijac";
import { useQuery } from "@tanstack/react-query";

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  }
const fetchUser = async () => {
    const {data} = await apiSijac.get<User[]>("/users/get_users")
    return data
}
export function useUser() {
    const {data: usersData, refetch: refetchUsers } = useQuery({
        queryKey: ["users"],
        queryFn: fetchUser,
        staleTime: Infinity,
      })
    return {usersData,refetchUsers}

}