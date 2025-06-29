import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import useAuthStore from "@/store/useAuthStore";
import apiSijac from "@/api/sijac";
import { useMutation } from "@tanstack/react-query";

type FormData = {
  name: string;
  type_room: string;
  description: string;
  price: number;
  images: FileList;
};

const postRoom = async (formData: FormData) => {
  const token = useAuthStore.getState().token;
  
  // Crear FormData para multipart
  const form = new FormData();
  form.append('name', formData.name);
  form.append('type_room', formData.type_room);
  form.append('description', formData.description);
  form.append('price', formData.price.toString());
  
  // Agregar cada imagen al FormData
  Array.from(formData.images).forEach((file) => {
    form.append(`images`, file);
  });

  const { data } = await apiSijac.post("/room/create", form, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const FormRoom = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const { mutate, isPending } = useMutation({
    mutationFn: postRoom,
    onSuccess: () => {
      alert("Oficina creada con éxito");
      reset();
    },
    onError: () => {
      alert("Error al crear la oficina contacte al admin o intente mas tarde");
    },
  });

  const [imagenesPrevisualizacion, setImagenesPrevisualizacion] = useState<string[]>([]);

  //const imagenes = watch("images");

  const onSubmit = (data: FormData) => {
    mutate(data);
  };

  const manejarCambioImagenes = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const archivos = Array.from(e.target.files);
        
        // Validar tamaño de archivos (max 2MB)
        const archivosValidos = archivos.filter(archivo => archivo.size <= 2 * 1024 * 1024);
        if (archivosValidos.length !== archivos.length) {
          alert("Algunas imágenes superan el límite de 2MB y no fueron seleccionadas.");
        }

        // Crear URLs para previsualización
        const urlsPrevisualizacion = archivosValidos.map(archivo => URL.createObjectURL(archivo));
        setImagenesPrevisualizacion(urlsPrevisualizacion);
      }
    },
    []
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-prim-500">Información de la Oficina</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
        {/* Campo Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la oficina *
          </label>
          <input
            {...register("name", { required: "El nombre es obligatorio" })}
            className={`w-full px-3 py-2 border rounded-md ${errors.name ? "border-red-500" : "border-gray-300"}`}
            placeholder="Oficina Ejecutiva"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Campo Tipo de Oficina */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de oficina *
          </label>
          <input
            {...register("type_room", { required: "El tipo es obligatorio" })}
            className={`w-full px-3 py-2 border rounded-md ${errors.type_room ? "border-red-500" : "border-gray-300"}`}
            placeholder="Ej: Privada, Coworking, Ejecutiva"
          />
          {errors.type_room && (
            <p className="mt-1 text-sm text-red-500">{errors.type_room.message}</p>
          )}
        </div>

        {/* Campo Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción *
          </label>
          <textarea
            {...register("description", { required: "La descripción es obligatoria" })}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md ${errors.description ? "border-red-500" : "border-gray-300"}`}
            placeholder="Describa las características de la oficina..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Campo Precio (en pesos por hora) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio por hora (pesos) *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              $
            </span>
            <input
              type="number"
              {...register("price", {
                required: "El precio es obligatorio",
                min: { value: 1, message: "El precio debe ser positivo" },
                valueAsNumber: true,
              })}
              className={`w-full pl-8 px-3 py-2 border rounded-md ${errors.price ? "border-red-500" : "border-gray-300"}`}
              placeholder="2500"
              step="100"
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>

        {/* Campo Imágenes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imágenes * (máx 2MB cada una)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            {...register("images", {
              required: "Al menos una imagen es obligatoria",
              onChange: manejarCambioImagenes,
            })}
            className={`w-full px-3 py-2 border rounded-md ${errors.images ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.images && (
            <p className="mt-1 text-sm text-red-500">{errors.images.message}</p>
          )}
        </div>

        {/* Previsualización de Imágenes */}
        {imagenesPrevisualizacion.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vista previa de imágenes
            </label>
            <div className="flex flex-wrap gap-2">
              {imagenesPrevisualizacion.map((img, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img
                    src={img}
                    alt={`Vista previa ${index}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botón de Envío */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-prim-500 hover:bg-prim-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
        >
          {isPending ? "Creando..." : "Crear Oficina"}
        </button>
      </form>
    </div>
  );
};