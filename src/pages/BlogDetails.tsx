import { useParams } from 'react-router-dom'
import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import apiSijac from '@/api/sijac'
import { FaWhatsapp, FaInstagram, FaCopy, FaCaretDown, FaFacebook } from 'react-icons/fa'

const fetchBlogDetails = async (ctx: QueryFunctionContext) => {
    const [_, id] = ctx.queryKey
    void _
    const { data } = await apiSijac.get(`/blog/get/${id}`)
    return data
}

const BlogDetails = () => {
    const { id } = useParams()
    const { data, isLoading } = useQuery({
        queryKey: ["blog-details", id],
        queryFn: fetchBlogDetails,
        staleTime: Infinity
    })

    if (isLoading) return <div className="text-center min-h-screen">Cargando...</div>
    if (!data) return <div className="text-center min-h-screen">No se encontraron detalles</div>

    const { title, body, url_image, user, created_at } = data
    const { first_name, last_name, specialty, url_image: userImage } = user
    const blogUrl = `${window.location.origin}/blog/${id}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(blogUrl)
        alert('Enlace copiado al portapapeles')
    }

    // Formateamos la fecha de publicación
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 min-h-screen">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="relative h-96 bg-gray-200">
                    <img 
                        src={url_image} 
                        alt={title} 
                        className="object-contain w-full h-full" 
                    />
                </div>
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                    <p className="mt-4 text-gray-600">{body}</p>

                    <div className="mt-4 text-gray-500 text-sm">
                        <p>Publicado el: {formatDate(created_at)}</p>
                    </div>

                    <div className="mt-8 flex items-center space-x-4">
                        <img 
                            src={`http://18.119.164.103/image/get_image_blog/${userImage}`} 
                            alt={`${first_name} ${last_name}`} 
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <p className="text-lg font-semibold">{first_name} {last_name}</p>
                            <p className="text-sm text-gray-500">{specialty}</p>
                        </div>
                    </div>

                    {/* Label para los botones de compartir */}
                    <div className="mt-6">
                        <p className="text-lg font-semibold text-gray-900">Compartir</p>
                    </div>

                    {/* Botones de compartir */}
                    <div className="mt-4 flex space-x-4">
                        {/* Botón WhatsApp */}
                        <a 
                            href={`https://wa.me/?text=${encodeURIComponent(blogUrl)}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="px-4 py-2 bg-prim-500 text-white rounded-lg shadow-md flex items-center space-x-2 hover:bg-prim-600"
                        >
                            <FaWhatsapp className="text-xl" />
                            <span>WhatsApp</span>
                            <FaCaretDown className="text-sm" />
                        </a>

                        {/* Botón Instagram */}
                        <a 
                            href={`https://www.instagram.com/sharer.php?u=${encodeURIComponent(blogUrl)}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md flex items-center space-x-2 hover:bg-blue-600"
                        >
                            <FaInstagram className="text-xl" />
                            <span>Instagram</span>
                            <FaCaretDown className="text-sm" />
                        </a>

                        {/* Botón Facebook */}
                        <a 
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md flex items-center space-x-2 hover:bg-blue-800"
                        >
                            <FaFacebook className="text-xl" />
                            <span>Facebook</span>
                            <FaCaretDown className="text-sm" />
                        </a>

                        {/* Botón Copiar enlace */}
                        <button 
                            onClick={copyToClipboard} 
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md flex items-center space-x-2 hover:bg-gray-700"
                        >
                            <FaCopy className="text-xl" />
                            <span>Copiar enlace</span>
                            <FaCaretDown className="text-sm" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogDetails
