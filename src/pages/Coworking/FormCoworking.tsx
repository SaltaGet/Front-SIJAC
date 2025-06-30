import apiSijac from "@/api/sijac";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import useAuthStore from "@/store/useAuthStore";
import { RoomPlan, useGetAllRoomPlans } from "@/hooks/roomPlan/useGetAllRoomPlans";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tuition: string;
  useRoomPlan: boolean;
  roomPlanId: string;
}

interface FormCoworkingProps {
  onClose: () => void;
  selectedAppointments: string[];
  roomId: string;
}

interface RoomAppointmentPayload {
  appointment_ids: string[];
  first_name: string;
  last_name: string;
  email: string;
  cellphone: string;
  tuition: string;
  room_availability_id: string;
}

const assignRoomPlan = async ({ room_plan_id, appointment_ids }: { room_plan_id: string, appointment_ids: string[] }) => {
  const token = useAuthStore.getState().token;
  const { data } = await apiSijac.put(
    `/room_plan/assign_appointments/${room_plan_id}`, 
    { appointment_ids },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return data;
}

const postCreateRoomAppointment = async (payload: RoomAppointmentPayload) => {
  const token = useAuthStore.getState().token;
  
  if (token) {
    const { data } = await apiSijac.put(
      "/room_appointment/create_by_secretary", 
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return data;
  }
  
  const { data } = await apiSijac.put("/room_appointment/create", payload);
  return data;
}

export const FormCoworking = ({ onClose, selectedAppointments, roomId }: FormCoworkingProps) => {
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<FormData>({
    defaultValues: {
      useRoomPlan: false
    }
  });

  const {roomPlans } = useGetAllRoomPlans();
  const [showSuccess, setShowSuccess] = useState(false);
  const token = useAuthStore.getState().token;
  const queryClient = useQueryClient();

  const useRoomPlan = watch("useRoomPlan");

  const { mutate: assignRoomPlanMutation, isPending: isAssigningPlan } = useMutation({
    mutationFn: assignRoomPlan,
    onSuccess: () => {
      setShowSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["roomAppoinment"] });
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    },
    onError: () => {
      alert("Solo se puede crear con 3 días de anticipación o el cliente no tiene suficientes horas.");
    },
  });

  const { mutate: createAppointment, isPending: isCreatingAppointment } = useMutation({
    mutationFn: postCreateRoomAppointment,
    onSuccess: () => {
      setShowSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["roomAppointment"] });
      const timer = setTimeout(() => {
        onClose();
        if (!token) {
          window.location.reload();
        }
      }, token ? 2000 : 5000);
      return () => clearTimeout(timer);
    },
    onError: () => {
      alert("Error al crear la reserva. Por favor intente nuevamente más tarde.");
    },
  });

  const onSubmit = (data: FormData) => {
    if (token && data.useRoomPlan) {
      // Flujo con room plan (solo para secretaría)
      assignRoomPlanMutation({
        room_plan_id: data.roomPlanId,
        appointment_ids: selectedAppointments
      });
    } else {
      // Flujo normal o de secretaría sin room plan
      const reservationData: RoomAppointmentPayload = {
        appointment_ids: selectedAppointments,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        cellphone: data.phone,
        tuition: data.tuition,
        room_availability_id: roomId
      };
      createAppointment(reservationData);
    }
  };

  const isPending = isCreatingAppointment || isAssigningPlan;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Reservar espacio</h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-500 transition-colors"
              disabled={isPending}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {showSuccess ? (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">¡Reserva {token ? "creada" : "enviada"} con éxito!</h3>
              <p className="text-sm text-gray-500">
                {token ? (
                  "La reserva ha sido registrada correctamente."
                ) : (
                  "Por favor revise su correo electrónico para confirmar la reserva."
                )}
                <br />
                Este mensaje se cerrará automáticamente en unos segundos.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {token && (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="useRoomPlan"
                      type="checkbox"
                      {...register("useRoomPlan")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="useRoomPlan" className="ml-2 block text-sm text-gray-700">
                      Usar Plan de Sala
                    </label>
                  </div>

                  {useRoomPlan && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Plan de Sala *</label>
                      <select
                        {...register("roomPlanId", { required: useRoomPlan ? "Seleccione un plan" : false })}
                        className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-1 focus:border-blue-500 focus:ring-blue-500 outline-none transition-all ${
                          errors.roomPlanId ? "border-red-400" : "border-gray-300 hover:border-gray-400"
                        }`}
                        disabled={isPending}
                      >
                        <option value="">Seleccione un plan</option>
                        {roomPlans?.map((plan: RoomPlan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.first_name} {plan.last_name}
                          </option>
                        ))}
                      </select>
                      {errors.roomPlanId && (
                        <p className="mt-1 text-xs text-red-600">{errors.roomPlanId.message}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {!useRoomPlan && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre *</label>
                      <div className="relative">
                        <input
                          {...register("firstName", { required: "Requerido" })}
                          className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-1 focus:border-blue-500 focus:ring-blue-500 outline-none transition-all ${
                            errors.firstName ? "border-red-400" : "border-gray-300 hover:border-gray-400"
                          }`}
                          placeholder="Juan"
                          disabled={isPending}
                        />
                        {errors.firstName && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {errors.firstName && (
                        <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Apellido *</label>
                      <div className="relative">
                        <input
                          {...register("lastName", { required: "Requerido" })}
                          className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-1 focus:border-blue-500 focus:ring-blue-500 outline-none transition-all ${
                            errors.lastName ? "border-red-400" : "border-gray-300 hover:border-gray-400"
                          }`}
                          placeholder="Pérez"
                          disabled={isPending}
                        />
                        {errors.lastName && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {errors.lastName && (
                        <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                    <div className="relative">
                      <input
                        type="email"
                        {...register("email", { 
                          required: "Requerido",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Email inválido"
                          }
                        })}
                        className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-1 focus:border-blue-500 focus:ring-blue-500 outline-none transition-all ${
                          errors.email ? "border-red-400" : "border-gray-300 hover:border-gray-400"
                        }`}
                        placeholder="juan.perez@ejemplo.com"
                        disabled={isPending}
                      />
                      {errors.email && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono *</label>
                      <div className="relative">
                        <input
                          {...register("phone", { required: "Requerido" })}
                          className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-1 focus:border-blue-500 focus:ring-blue-500 outline-none transition-all ${
                            errors.phone ? "border-red-400" : "border-gray-300 hover:border-gray-400"
                          }`}
                          placeholder="+54 11 2345-6789"
                          disabled={isPending}
                        />
                        {errors.phone && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Matrícula *</label>
                      <div className="relative">
                        <input
                          {...register("tuition", { required: "Requerido" })}
                          className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-1 focus:border-blue-500 focus:ring-blue-500 outline-none transition-all ${
                            errors.tuition ? "border-red-400" : "border-gray-300 hover:border-gray-400"
                          }`}
                          placeholder="AB123456"
                          disabled={isPending}
                        />
                        {errors.tuition && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {errors.tuition && (
                        <p className="mt-1 text-xs text-red-600">{errors.tuition.message}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                  disabled={isPending}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    "Confirmar reserva"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};