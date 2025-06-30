import { useForm } from "react-hook-form";
import useAuthStore from "@/store/useAuthStore";
import apiSijac from "@/api/sijac";
import { useMutation } from "@tanstack/react-query";

type FormData = {
  first_name: string;
  last_name: string;
  email: string;
  cellphone: string;
  tuition: string;
};

const postPlan = async (formData: FormData) => {
  const token = useAuthStore.getState().token;
  
  const { data } = await apiSijac.post("/room_plan/create", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const FormRoomPlan = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const { mutate, isPending } = useMutation({
    mutationFn: postPlan,
    onSuccess: () => {
      alert("Plan creado con éxito");
      reset();
    },
    onError: () => {
      alert("Error al crear el plan, contacte al admin o intente mas tarde");
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-prim-500">Crear Cliente para Plan</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Campo Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            {...register("first_name", { required: "El nombre es obligatorio" })}
            className={`w-full px-3 py-2 border rounded-md ${errors.first_name ? "border-red-500" : "border-gray-300"}`}
            placeholder="Juan"
          />
          {errors.first_name && (
            <p className="mt-1 text-sm text-red-500">{errors.first_name.message}</p>
          )}
        </div>

        {/* Campo Apellido */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellido *
          </label>
          <input
            {...register("last_name", { required: "El apellido es obligatorio" })}
            className={`w-full px-3 py-2 border rounded-md ${errors.last_name ? "border-red-500" : "border-gray-300"}`}
            placeholder="Pérez"
          />
          {errors.last_name && (
            <p className="mt-1 text-sm text-red-500">{errors.last_name.message}</p>
          )}
        </div>

        {/* Campo Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            {...register("email", { 
              required: "El email es obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido"
              }
            })}
            className={`w-full px-3 py-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"}`}
            placeholder="juan.perez@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Campo Teléfono */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono celular *
          </label>
          <input
            type="tel"
            {...register("cellphone", { 
              required: "El teléfono es obligatorio",
              pattern: {
                value: /^[0-9]{10,15}$/,
                message: "Teléfono inválido (solo números, 10-15 dígitos)"
              }
            })}
            className={`w-full px-3 py-2 border rounded-md ${errors.cellphone ? "border-red-500" : "border-gray-300"}`}
            placeholder="1234567890"
          />
          {errors.cellphone && (
            <p className="mt-1 text-sm text-red-500">{errors.cellphone.message}</p>
          )}
        </div>

        {/* Campo Matrícula */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Matrícula *
          </label>
          <input
            {...register("tuition", { required: "La matrícula es obligatoria" })}
            className={`w-full px-3 py-2 border rounded-md ${errors.tuition ? "border-red-500" : "border-gray-300"}`}
            placeholder="A12345678"
          />
          {errors.tuition && (
            <p className="mt-1 text-sm text-red-500">{errors.tuition.message}</p>
          )}
        </div>

        {/* Botón de Envío */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-prim-500 hover:bg-prim-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
        >
          {isPending ? "Creando..." : "Crear Plan"}
        </button>
      </form>
    </div>
  );
};