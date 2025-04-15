import { Blog, usePostGet } from "@/hooks/client/usePostGet"
import { useState } from "react"
import FormEditPost from "./FomrEditPost"

export default function AdimEditPost() {
  const {
    blogs,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = usePostGet()

  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)

  if (status === "error")
    return <p>error al cargar los blogs: {String(error)}</p>

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* lista de blogs */}
      <div className="md:col-span-1">
        <h2 className="text-xl font-bold mb-4">Lista de Blogs</h2>
        <ul className="space-y-2">
          {blogs.map((blog) => (
            <li
              key={blog.id}
              onClick={() => setSelectedBlog(blog)}
              className={`cursor-pointer flex items-center gap-2 hover:text-blue-600 ${
                selectedBlog?.id === blog.id ? "font-bold text-blue-700" : ""
              }`}
            >
              <img
                src={blog.url_image}
                alt={blog.title}
                className="w-10 h-10 object-cover rounded"
              />
              <span>{blog.title}</span>
            </li>
          ))}
        </ul>

        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isFetchingNextPage ? "Cargando..." : "Ver más"}
          </button>
        )}
      </div>

      {/* detalles del blog seleccionado */}
      <div className="md:col-span-2">
        {selectedBlog ? (
          <FormEditPost blog={selectedBlog} />
        ) : (
          <p>selecciona un blog para ver los detalles</p>
        )}
      </div>
    </div>
  )
}
