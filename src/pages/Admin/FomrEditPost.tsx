import { usePost } from "@/hooks/admin/usePost";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaImage } from "react-icons/fa";

interface Blog {
  id: string;
  title: string;
  body: string;
  url_image: string;
  categories: string;
  created_at: string;
  updated_at: string;
  favorite: boolean; // Asegúrate de que la interfaz Blog incluya este campo
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    specialty: string;
    url_image: string;
  };
}

interface FormData {
  title: string;
  body: string;
  categories: string;
  image?: FileList;
  favorite: boolean; // Corregí el typo "favorte" a "favorite"
}

interface FormEditPostProps {
  blog: Blog;
}

const FormEditPost: React.FC<FormEditPostProps> = ({ blog }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      favorite: blog.favorite, // Establecer el valor inicial desde el blog
    },
  });

  const [preview, setPreview] = useState<string | null>(blog.url_image);
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    editPost,
    isEditing,
    removePost,
    isDeleting,
    resetStatuses,
    deleteStatus,
  } = usePost();

  const imageFile = watch("image");

  useEffect(() => {
    resetStatuses();
    // Resetear los valores del formulario cuando cambia el blog
    reset({
      title: blog.title,
      body: blog.body,
      categories: blog.categories,
      favorite: blog.favorite, // Incluir el valor de favorite al resetear
    });
    setPreview(blog.url_image);
  }, [blog, reset]);

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(blog.url_image);
    }
  }, [imageFile, blog.url_image]);

  useEffect(() => {
    if (showSuccess) setShowSuccess(false);
  }, [watch()]);

  const onSubmit = (data: FormData) => {
    const formData = {
      ...data,
      image: imageFile?.length ? imageFile : undefined,
    };

    const payload = {
      blog_id: blog.id,
      formData,
    };

    console.log("Formulario enviado con los siguientes datos:", payload);
    editPost(payload);
    setShowSuccess(true);
  };

  const handleDelete = () => {
    removePost(blog.id);
  };

  if (deleteStatus === "success") return <div>Post Borrado</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-4 max-w-xl mx-auto"
    >
      {/* título */}
      <div className="flex flex-col">
        <label htmlFor="title" className="text-gray-900 font-medium mb-1">
          Título *
        </label>
        <input
          id="title"
          type="text"
          {...register("title", {
            required: "el título es obligatorio",
            minLength: { value: 1, message: "mínimo 1 carácter" },
            maxLength: { value: 100, message: "máximo 100 caracteres" },
          })}
          className="border border-gray-300 rounded-md p-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
        {errors.title && (
          <span className="text-sm text-red-600 mt-1">
            {errors.title.message}
          </span>
        )}
      </div>

      {/* cuerpo */}
      <div className="flex flex-col">
        <label htmlFor="body" className="text-gray-900 font-medium mb-1">
          Cuerpo *
        </label>
        <textarea
          id="body"
          {...register("body", {
            required: "el cuerpo no puede estar vacío",
            minLength: {
              value: 20,
              message: "el cuerpo debe tener al menos 20 caracteres",
            },
          })}
          className="border border-gray-300 rounded-md p-2 bg-white text-black h-32 resize-none focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
        {errors.body && (
          <span className="text-sm text-red-600 mt-1">
            {errors.body.message}
          </span>
        )}
      </div>

      {/* categorías */}
      <div className="flex flex-col">
        <label htmlFor="categories" className="text-gray-900 font-medium mb-1">
          Categoría *
        </label>
        <select
          id="categories"
          {...register("categories", {
            required: "la categoría es obligatoria",
          })}
          defaultValue={blog.categories}
          className="border border-gray-300 rounded-md p-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
        >
          <option value="VARIOS">VARIOS</option>
          <option value="ACTIVIDADES">ACTIVIDADES</option>
          <option value="AVISOS">AVISOS</option>
          <option value="NOTICIAS">NOTICIAS</option>
        </select>
        {errors.categories && (
          <span className="text-sm text-red-600 mt-1">
            {errors.categories.message}
          </span>
        )}
      </div>

      {/* imagen */}
      <div className="flex flex-col gap-2">
        <label htmlFor="image" className="text-gray-900 font-medium">
          Imagen *
        </label>
        <div className="flex items-center gap-3">
          <label
            htmlFor="image"
            className="cursor-pointer flex items-center gap-2 text-white bg-gray-800 hover:bg-gray-900 px-4 py-2 rounded-md transition"
          >
            <FaImage />
            Seleccionar imagen
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            {...register("image", {
              validate: {
                lessThan2MB: (files) =>
                  !files?.[0] ||
                  files[0].size < 2 * 1024 * 1024 ||
                  "La imagen debe pesar menos de 2MB",
                acceptedFormats: (files) =>
                  !files?.[0] ||
                  ["image/jpeg", "image/png", "image/webp"].includes(
                    files[0].type
                  ) ||
                  "Formato no permitido (solo jpg, png o webp)",
              },
            })}
            className="hidden"
          />
        </div>

        {/* Mostrar errores de validación */}
        {errors.image && (
          <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
        )}

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-48 h-48 object-cover rounded-md border border-gray-300 mt-2"
          />
        )}
      </div>

      {/* checkbox favorite */}
      <div className="flex items-center">
        <input
          id="favorite"
          type="checkbox"
          {...register("favorite")}
          className="h-4 w-4 text-gray-800 focus:ring-gray-800 border-gray-300 rounded"
        />
        <label htmlFor="favorite" className="ml-2 block text-sm text-gray-900">
          Fijar
        </label>
      </div>

      {/* botones */}
      <div className="flex gap-4">
        {!isEditing ? (
          <button
            type="submit"
            className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition"
          >
            Actualizar post
          </button>
        ) : (
          <label className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition">
            Editando
          </label>
        )}

        {!isDeleting ? (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
          >
            Borrar post
          </button>
        ) : (
          <label className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition">
            Borrando
          </label>
        )}
      </div>

      {/* mensajes de estado */}
      {showSuccess && (
        <p className="text-green-600 text-center mt-2">
          El post se actualizó correctamente.
        </p>
      )}
    </form>
  );
};

export default FormEditPost;
