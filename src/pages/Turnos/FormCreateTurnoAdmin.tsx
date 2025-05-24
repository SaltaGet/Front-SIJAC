import apiSijac from "@/api/sijac";
import useAuthStore from "@/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { Dispatch, SetStateAction,useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  id: string;
  modal: Dispatch<SetStateAction<boolean>>;
}

interface FormData {
  id: string;
  full_name: string;
  email: string;
  cellphone: string;
  reason: string;
}

const putAppoinment = async (payload: FormData) => {
    const token = useAuthStore.getState().token;
  const { data } = await apiSijac.put(`/appointment/create_by_user`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

const FormCreateTurnoAdmin: React.FC<Props> = ({ id, modal }) => {
  const [submitted, setSubmitted] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: putAppoinment,
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["appointmentsClient"] });
      setTimeout(() => {
        modal(false);
      }, 1000);
    },
    onError: () => {
      alert("Ocurrió un Error por favor intente más tarde");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    mutate({ ...data, id });
  };

  if (submitted) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-bold text-green-600">
          ¡Turno Creado por el profesional!
        </h2>
        <p className="mt-4 text-gray-700">
          En breve se cerrará esta ventana...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md mx-auto"
    >
      <div>
        <label>Nombre Completo</label>
        <input
          type="text"
          {...register("full_name", { required: true })}
          className="border p-2 w-full"
        />
        {errors.full_name && <span className="text-red-500">Obligatorio</span>}
      </div>

      <div>
        <label>Correo Electrónico</label>
        <input
          type="email"
          {...register("email", { required: true })}
          className="border p-2 w-full"
          placeholder="sijac@gmail.com"
        />
        {errors.email && <span className="text-red-500">Obligatorio</span>}
      </div>

      <div>
        <label>Numero de Teléfono</label>
        <input
          type="text"
          {...register("cellphone", { required: true })}
          className="border p-2 w-full"
          placeholder="3871234569"
        />
        {errors.cellphone && <span className="text-red-500">Obligatorio</span>}
      </div>

      <div>
        <label>Razón</label>
        <textarea
          {...register("reason", {
            required: true,
            maxLength: 100,
          })}
          className="border p-2 w-full"
          maxLength={100}
          onChange={(e) => {
            // Actualizar el valor mientras escribe
            register("reason").onChange(e);
            // También puedes manejar el valor aquí si necesitas
          }}
        />
        <div className="text-sm text-gray-500 text-right">
          {watch("reason")?.length || 0}/100 caracteres
        </div>
        {errors.reason?.type === "required" && (
          <span className="text-red-500">Obligatorio</span>
        )}
        {errors.reason?.type === "maxLength" && (
          <span className="text-red-500">Máximo 100 caracteres</span>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={isPending}
      >
        {isPending ? "Solicitando..." : "Solicitar Turno"}
      </button>

      <p className="text-red-600 font-semibold">
        Importante: el turno pasara a aceptado automáticamente
      </p>
    </form>
  );
};

export default FormCreateTurnoAdmin;
