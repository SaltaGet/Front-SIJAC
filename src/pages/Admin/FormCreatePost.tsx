import { usePost } from "@/hooks/admin/usePost";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaImage } from "react-icons/fa";

interface FormData {
  title: string;
  body: string;
  categories: string;
  image: FileList;
}

const FormCreatePost: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>();

  const { createPost, createStatus, isPosting } = usePost();

  const [preview, setPreview] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const imageFile = watch("image");
  const allValues = watch(); // observar todos los valores

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [imageFile]);

  // ocultar mensaje de éxito si cambia algo
  useEffect(() => {
    if (showSuccess) setShowSuccess(false);
  }, [allValues]);

  const onSubmit = (data: FormData) => {
    createPost(data, {
      onSuccess: () => {
        reset();
        setPreview(null);
        setShowSuccess(true);
      },
    });
  };

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
            minLength: { value: 3, message: "mínimo 3 caracteres" },
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
              value: 25,
              message: "el cuerpo debe tener al menos 25 caracteres",
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
            required: "las categorías son obligatorias",
          })}
          defaultValue="VARIOS"
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
              required: "la imagen es obligatoria",
            })}
            className="hidden"
          />
        </div>
        {errors.image && (
          <span className="text-sm text-red-600">{errors.image.message}</span>
        )}

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-48 h-48 object-cover rounded-md border border-gray-300 mt-2"
          />
        )}
      </div>

      {/* botón enviar */}
      <button
        type="submit"
        disabled={isPosting}
        className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition disabled:opacity-50"
      >
        {isPosting ? "Creando..." : "Crear post"}
      </button>

      {/* mensajes de estado */}
      {showSuccess && (
        <p className="text-green-600 text-center mt-2">
          El post se creó correctamente.
        </p>
      )}
      {createStatus === "error" && (
        <p className="text-red-600 text-center mt-2">
          Ocurrió un error al crear el post.
        </p>
      )}
    </form>
  );
};

export default FormCreatePost;
