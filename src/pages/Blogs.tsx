import { usePostGet } from "@/hooks/client/usePostGet"
import { Link } from "react-router-dom"

export default function Blogs() {
  const {
    blogs,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostGet()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-prim-600">Ultimas Novedades</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link
            to={`../blog/${blog.id}`}
            key={blog.id}
            className="bg-white flex flex-col rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-105"
          >
            <div className="relative w-full h-80">
              <img
                src={blog.url_image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col flex-grow px-4 py-3 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{blog.title}</h2>
              <p className="text-sm text-gray-500 mb-2 font-semibold">{blog.categories}</p>
              <p className="text-sm text-gray-700 line-clamp-3 mb-4">{blog.body}</p>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 bg-prim-100">
              <img
                src={blog.user.url_image}
                alt={blog.user.first_name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm text-gray-600 font-semibold">
                {blog.user.first_name} {blog.user.last_name}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="bg-prim-500 text-white px-6 py-2 rounded-xl hover:bg-prim-600 transition disabled:opacity-50"
          >
            {isFetchingNextPage ? "Cargando..." : "Cargar más"}
          </button>
        </div>
      )}
    </div>
  )
}
