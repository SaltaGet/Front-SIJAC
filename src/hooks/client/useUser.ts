import apiSijac from "@/api/sijac"
import { useQuery } from "@tanstack/react-query"

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  specialty: string
  url_image: string
}

const fetchUser = async () => {
  const { data } = await apiSijac.get<User[]>("/users/get_users")
  return data
}

export function useUser(mediador: boolean = false) {
  const { data, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUser,
    staleTime: Infinity,
  })

  const usersData = mediador
    ? data?.filter(user => user.specialty.includes("MEDIACIONES EXTRAJUDICIALES"))
    : data

  return { usersData, refetchUsers: refetch }
}