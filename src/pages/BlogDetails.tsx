import { useParams } from "react-router-dom";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import apiSijac from "@/api/sijac";
import {
  FaWhatsapp,
  FaFacebook,
  FaCopy,
  FaInstagram,
} from "react-icons/fa";
import Linkify from "react-linkify";

const fetchBlogDetails = async (ctx: QueryFunctionContext) => {
  const [_, id] = ctx.queryKey;
  void _;
  const { data } = await apiSijac.get(`/blog/get/${id}`);
  return data;
};

const BlogDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["blog-details", id],
    queryFn: fetchBlogDetails,
    staleTime: Infinity,
  });

  if (isLoading)
    return <div className="text-center min-h-screen py-16">Cargando...</div>;
  if (!data)
    return (
      <div className="text-center min-h-screen py-16">No se encontraron detalles</div>
    );

  const { title, body, url_image, user, created_at } = data;
  const { first_name, last_name, specialty, url_image: userImage } = user;
  const blogUrl = `${window.location.origin}/blog/${id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(blogUrl);
    alert("Enlace copiado al portapapeles");
  };

  // Formateamos la fecha de publicación
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 min-h-screen">
      <article className="bg-white border border-gray-100 overflow-hidden rounded-lg shadow-lg">
        <div className="relative h-96 bg-gray-50">
          <img
            src={url_image || "/placeholder.svg"}
            alt={title}
            className="object-contain w-full h-full"
          />
        </div>

        <div className="p-8 lg:p-12">
          <header className="mb-8">
            <h1 className="text-4xl font-light text-gray-900 leading-tight mb-4">{title}</h1>
            <time className="text-sm text-gray-500 font-medium">Publicado el: {formatDate(created_at)}</time>
          </header>

          <div className="prose prose-lg max-w-none mb-12">
            <Linkify
              componentDecorator={(decoratedHref, decoratedText, key) => (
                <a
                  href={decoratedHref}
                  key={key}
                  className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {decoratedText}
                </a>
              )}
            >
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">{body}</div>
            </Linkify>
          </div>

          <div className="flex items-center gap-4 pb-8 mb-8 border-b border-gray-100">
            <img
              src={userImage || "/placeholder.svg"}
              alt={`${first_name} ${last_name}`}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {first_name} {last_name}
              </h3>
              <p className="text-gray-600 font-medium">{specialty}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compartir artículo</h3>

            <div className="flex flex-wrap gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(blogUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors"
              >
                <FaWhatsapp className="w-4 h-4" />
                WhatsApp
              </a>

              <a
                href={`https://www.instagram.com/sharer.php?u=${encodeURIComponent(blogUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium rounded transition-colors"
              >
                <FaInstagram className="w-4 h-4" />
                Instagram
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
              >
                <FaFacebook className="w-4 h-4" />
                Facebook
              </a>

              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded transition-colors"
              >
                <FaCopy className="w-4 h-4" />
                Copiar enlace
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetails;