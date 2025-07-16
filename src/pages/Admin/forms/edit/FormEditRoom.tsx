import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiSijac from "@/api/sijac";
import useAuthStore from "@/store/useAuthStore";

type FormData = {
  name: string;
  type_room: string;
  description: string;
  price: number;
};

type FormEditRoomProps = {
  roomData: {
    name: string;
    type_room: string;
    description: string;
    price: number;
  };
  roomId: string;
  onClose?: () => void; // Prop opcional para cerrar el modal
};

const updateRoom = async ({ id, formData }: { id: string; formData: FormData }) => {
  const token = useAuthStore.getState().token;
  
  const { data } = await apiSijac.put(`/room/update/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const FormEditRoom = ({ roomData, roomId, onClose }: FormEditRoomProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormData>({
    defaultValues: roomData,
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateRoom,
    onSuccess: () => {
      alert("Oficina actualizada con éxito");
      queryClient.invalidateQueries({ queryKey: ["roomsAll"] });
      reset();
      onClose?.(); // Cierra el modal si existe la función
    },
    onError: () => {
      alert("Error al actualizar la oficina. Contacte al admin o intente más tarde");
    },
  });

  const onSubmit = (data: FormData) => {
    mutate({ id: roomId, formData: data });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-prim-500">Editar Oficina</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        {/* Campo Precio */}
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

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isPending || !isDirty}
            className={`flex-1 bg-prim-500 hover:bg-prim-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 ${
              (isPending || !isDirty) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isPending ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};