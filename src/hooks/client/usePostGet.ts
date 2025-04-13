import { useInfiniteQuery } from "@tanstack/react-query"
import apiSijac from "@/api/sijac"

export interface Blog {
  id: string
  title: string
  body: string
  url_image: string
  categories: string
  created_at: string
  updated_at: string
  user: {
    id: string
    email: string
    first_name: string
    last_name: string
    specialty: string
    url_image: string
  }
}

interface BlogResponse {
  page: number
  per_page: number
  total: number
  blogs: Blog[]
}

const fetchBlogs = async ({ pageParam = 1 }): Promise<BlogResponse> => {
  const { data } = await apiSijac.get<BlogResponse>(`/blog/get_all?page=${pageParam}`)
  return data
}

export function usePostGet() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / lastPage.per_page)
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined
    },
  })

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  }
}
