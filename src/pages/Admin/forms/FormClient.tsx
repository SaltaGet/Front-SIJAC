import apiSijac from "@/api/sijac";
import useAuthStore from "@/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

type FormData = {
  first_name: string;
  last_name: string;
  dni: string;
  email: string;
  phone: string;
};

const postClient = async (form: FormData) => {
  const token = useAuthStore.getState().token;
  const { data } = await apiSijac.post("/client/create", form, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

export default function ClientForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: postClient,
    onSuccess: (res) => {
      console.log(res);
      reset();
      queryClient.invalidateQueries({ queryKey: ["clients-all-admin"] });
      alert("Cliente creado con éxito");

    },
    onError: () => {
      alert("Error al crear el cliente");
    },
  });

  const onSubmit = (data: FormData) => mutate(data);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Datos del Cliente</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Sección de información básica */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">Nombre*</label>
            <input
              {...register("first_name", { required: "Requerido" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.first_name && (
              <p className="mt-1 text-xs text-red-500">{errors.first_name.message}</p>
            )}
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">Apellido*</label>
            <input
              {...register("last_name", { required: "Requerido" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.last_name && (
              <p className="mt-1 text-xs text-red-500">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        {/* Campo importante - DNI */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">DNI*</label>
          <input
            {...register("dni", {
              required: "Requerido",
              pattern: {
                value: /^[0-9]{8,10}$/,
                message: "DNI inválido (8-10 dígitos)",
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Ej: 12345678"
          />
          {errors.dni && (
            <p className="mt-1 text-xs text-red-500">{errors.dni.message}</p>
          )}
        </div>

        {/* Sección de contacto */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Información de contacto</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email*</label>
            <input
              type="email"
              {...register("email", {
                required: "Requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email inválido",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Teléfono*</label>
            <input
              {...register("phone", {
                required: "Requerido",
                pattern: {
                  value: /^[0-9+\- ]+$/,
                  message: "Teléfono inválido",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-6 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? "Guardando..." : "Registrar Cliente"}
        </button>
      </form>
    </div>
  );
}