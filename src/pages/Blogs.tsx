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
    <div className="max-w-6xl mx-auto px-6 py-12 min-h-screen">
      <h1 className="text-4xl font-light text-gray-900 mb-8">Últimas Novedades</h1>

      {/* Sección de blogs fijados/favoritos */}
      {favoriteBlogs.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">Blogs destacados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
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
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">Todos los artículos</h2>
        
        {regularBlogs.length === 0 ? (
          <p className="text-gray-600 text-lg text-center py-12">No hay noticias por ahora.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularBlogs.map((blog) => (
                <BlogCard 
                  blog={blog} 
                  isFavorite={favoriteBlogs.some(fav => fav.id === blog.id)} 
                  key={`reg-${blog.id}`}
                />
              ))}
            </div>

            {hasNextRegularPage && (
              <div className="flex justify-center mt-12">
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
      className={`bg-white flex flex-col rounded-lg border border-gray-100 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
        isFavorite ? "border-l-4 border-l-yellow-400" : ""
      }`}
    >
      {isFavorite && (
        <div className="absolute top-3 right-3 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
          Destacado
        </div>
      )}
      
      <div className="relative w-full h-60 bg-gray-50">
        <img
          src={blog.url_image || '/placeholder-blog.jpg'}
          alt={blog.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-blog.jpg'
          }}
        />
      </div>

      <div className="flex flex-col flex-grow p-5">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {blog.title}
        </h2>
        
        {blog.categories && (
          <p className="text-xs text-prim-600 font-medium mb-3 uppercase tracking-wide">
            {blog.categories}
          </p>
        )}
        
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
          {blog.body}
        </p>
        
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
          <img
            src={blog.user.url_image || '/placeholder-user.jpg'}
            alt={`${blog.user.first_name} ${blog.user.last_name}`}
            className="w-8 h-8 rounded-full object-cover border border-gray-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-user.jpg'
            }}
          />
          <span className="text-sm text-gray-700 font-medium">
            {blog.user.first_name} {blog.user.last_name}
          </span>
        </div>
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
      className="bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-900 transition-colors duration-300 disabled:opacity-50 font-medium"
    >
      {loading ? "Cargando..." : "Ver más artículos"}
    </button>
  )
}