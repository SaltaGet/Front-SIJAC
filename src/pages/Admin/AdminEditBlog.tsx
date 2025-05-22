import { Blog, usePostGet } from "@/hooks/client/usePostGet";
import { usePostGetFavorite } from "@/hooks/client/usePostGetFavorite";
import { useState } from "react";
import FormEditPost from "./FomrEditPost";
import useAuthStore from "@/store/useAuthStore";

export default function AdimEditPost() {
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  
  const {
    blogs: allBlogs,
    fetchNextPage: fetchNextAll,
    hasNextPage: hasNextAll,
    isFetchingNextPage: isFetchingNextAll,
    status: statusAll,
    error: errorAll,
  } = usePostGet();

  const {
    blogs: favoriteBlogs,
    fetchNextPage: fetchNextFavorite,
    hasNextPage: hasNextFavorite,
    isFetchingNextPage: isFetchingNextFavorite,
    status: statusFavorite,
    error: errorFavorite,
  } = usePostGetFavorite();

  const { userId } = useAuthStore();
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  // Función para manejar la selección de blog (solo permite seleccionar los tuyos)
  const handleSelectBlog = (blog: Blog) => {
    if (blog.user.id === userId) {
      setSelectedBlog(blog);
    }
  };

  // Determinar qué datos mostrar según la pestaña activa
  const currentBlogs = activeTab === 'all' ? allBlogs : favoriteBlogs;
  const currentStatus = activeTab === 'all' ? statusAll : statusFavorite;
  const currentError = activeTab === 'all' ? errorAll : errorFavorite;
  const hasNextPage = activeTab === 'all' ? hasNextAll : hasNextFavorite;
  const isFetchingNextPage = activeTab === 'all' ? isFetchingNextAll : isFetchingNextFavorite;
  const fetchNextPage = activeTab === 'all' ? fetchNextAll : fetchNextFavorite;

  if (currentStatus === "error") {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
        <p>Error al cargar blogs: {String(currentError)}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-6 bg-gray-50 rounded-lg">
      {/* Sidebar - Lista de blogs */}
      <div className="md:col-span-1 space-y-4">
        <div className="flex flex-col space-y-4">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-2 px-4 text-center font-medium text-sm ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('all')}
            >
              Blogs
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {allBlogs.length}
              </span>
            </button>
            <button
              className={`flex-1 py-2 px-4 text-center font-medium text-sm ${activeTab === 'favorites' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('favorites')}
            >
              Fijados
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {favoriteBlogs.length}
              </span>
            </button>
          </div>
        </div>

        {currentBlogs.length === 0 ? (
          <div className="p-3 bg-gray-100 rounded-lg text-sm text-gray-500">
            {activeTab === 'all' ? 'No hay blogs disponibles.' : 'No tienes blogs favoritos.'}
          </div>
        ) : (
          <ul className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            {currentBlogs.map((blog) => {
              const isMine = blog.user.id === userId;
              const isSelected = selectedBlog?.id === blog.id;
              
              return (
                <li
                  key={blog.id}
                  onClick={() => handleSelectBlog(blog)}
                  className={`p-3 rounded-lg transition-all flex items-center gap-3 ${
                    isMine 
                      ? isSelected
                        ? "bg-blue-50 border-l-4 border-blue-500 cursor-pointer"
                        : "bg-blue-50 cursor-pointer hover:bg-blue-100"
                      : "bg-gray-100 cursor-not-allowed"
                  }`}
                >
                  <img
                    src={blog.url_image}
                    alt={blog.title}
                    className="w-10 h-10 object-cover rounded-md border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-medium truncate block ${
                      isMine ? "text-gray-700" : "text-gray-400"
                    }`}>
                      {blog.title}
                    </span>
                    <span className="text-xs text-gray-500">
                      {isMine ? "(Tú)" : blog.user.first_name}
                    </span>
                  </div>
                  {activeTab === 'favorites' && (
                    <span className="text-yellow-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full mt-4 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            {isFetchingNextPage ? "Cargando..." : "Cargar más"}
          </button>
        )}
      </div>

      {/* Panel de edición */}
      <div className="md:col-span-3">
        {selectedBlog ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <FormEditPost blog={selectedBlog} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-gray-500">
            <p>Selecciona uno de tus blogs para editar</p>
          </div>
        )}
      </div>
    </div>
  );
}