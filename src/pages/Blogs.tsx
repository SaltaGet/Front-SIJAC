import { usePostGet } from "@/hooks/client/usePostGet"
import { usePostGetFavorite } from "@/hooks/client/usePostGetFavorite"
import { Link } from "react-router-dom"

export default function Blogs() {
  const {
    blogs: regularBlogs,
    fetchNextPage: fetchNextRegularPage,
    hasNextPage: hasNextRegularPage,
    isFetchingNextPage: isFetchingNextRegularPage,
  } = usePostGet()

  const {
    blogs: favoriteBlogs,
    fetchNextPage: fetchNextFavoritePage,
    hasNextPage: hasNextFavoritePage,
    isFetchingNextPage: isFetchingNextFavoritePage,
  } = usePostGetFavorite()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-prim-600">Últimas Novedades</h1>

      {/* Sección de blogs fijados/favoritos */}
      {favoriteBlogs.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-yellow-600">Blogs destacados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {favoriteBlogs.map((blog) => (
              <BlogCard blog={blog} isFavorite={true} key={`fav-${blog.id}`} />
            ))}
          </div>
          
          {hasNextFavoritePage && (
            <div className="flex justify-center">
              <LoadMoreButton 
                onClick={fetchNextFavoritePage}
                disabled={isFetchingNextFavoritePage}
                loading={isFetchingNextFavoritePage}
              />
            </div>
          )}
        </div>
      )}

      {/* Sección de blogs normales */}
      <div className="mt-8">
        {regularBlogs.length === 0 ? (
          <p className="text-gray-600 text-lg">No hay noticias por ahora.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularBlogs.map((blog) => (
                <BlogCard 
                  blog={blog} 
                  isFavorite={favoriteBlogs.some(fav => fav.id === blog.id)} 
                  key={`reg-${blog.id}`}
                />
              ))}
            </div>

            {hasNextRegularPage && (
              <div className="flex justify-center mt-8">
                <LoadMoreButton 
                  onClick={fetchNextRegularPage}
                  disabled={isFetchingNextRegularPage}
                  loading={isFetchingNextRegularPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Tipos para los props del componente BlogCard
interface BlogCardProps {
  blog: {
    id: string
    title: string
    body: string
    url_image: string
    categories: string
    user: {
      first_name: string
      last_name: string
      url_image: string
    }
  }
  isFavorite: boolean
}

// Componente de tarjeta de blog con tipos
function BlogCard({ blog, isFavorite }: BlogCardProps) {
  return (
    <Link
      to={`../blog/${blog.id}`}
      className={`bg-white flex flex-col rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 ${
        isFavorite ? "border-2 border-yellow-400" : ""
      }`}
    >
      {isFavorite && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-md text-xs font-bold">
          Favorito
        </div>
      )}
      
      <div className="relative w-full h-80">
        <img
          src={blog.url_image}
          alt={blog.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-blog.jpg'
          }}
        />
      </div>

      <div className={`flex flex-col flex-grow px-4 py-3 ${isFavorite ? "bg-yellow-50" : "bg-gray-50"}`}>
        <h2 className={`text-xl font-semibold mb-2 ${isFavorite ? "text-yellow-700" : "text-gray-800"}`}>
          {blog.title}
        </h2>
        <p className="text-sm text-gray-500 mb-2 font-semibold">{blog.categories}</p>
        <p className="text-sm text-gray-700 line-clamp-3 mb-4">{blog.body}</p>
      </div>

      <div className={`flex items-center gap-3 px-4 py-3 ${isFavorite ? "bg-yellow-100" : "bg-prim-100"}`}>
        <img
          src={blog.user.url_image}
          alt={`${blog.user.first_name} ${blog.user.last_name}`}
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-user.jpg'
          }}
        />
        <span className="text-sm text-gray-600 font-semibold">
          {blog.user.first_name} {blog.user.last_name}
        </span>
      </div>
    </Link>
  )
}

// Tipos para los props del botón
interface LoadMoreButtonProps {
  onClick: () => void
  disabled: boolean
  loading: boolean
}

// Componente de botón con tipos
function LoadMoreButton({ onClick, disabled, loading }: LoadMoreButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-prim-500 text-white px-6 py-2 rounded-xl hover:bg-prim-600 transition disabled:opacity-50"
    >
      {loading ? "Cargando..." : "Cargar más"}
    </button>
  )
}