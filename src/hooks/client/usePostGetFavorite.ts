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
  favorite: boolean
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
  total_pages: number
  data: Blog[] // ← este campo se llama "data", no "blogs"
}

const fetchBlogs = async ({ pageParam = 1 }): Promise<BlogResponse> => {
  const { data } = await apiSijac.get<BlogResponse>(`/blog/get_favorites?page=${pageParam}`)
  return data
}

export function usePostGetFavorite() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["blogs-favorite"],
    queryFn: fetchBlogs,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined
    },
  })

  // flatten para tener un array plano de posts
  const blogs = data?.pages.flatMap((page) => page.data) ?? []

  return {
    blogs,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  }
}
