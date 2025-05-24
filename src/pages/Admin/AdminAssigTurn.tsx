import {
  AppointmentClient,
  useAppointmentClient,
} from "@/hooks/client/useAppointmentClient";
import { useAvailability } from "@/hooks/useAvailability";
import { useUser } from "@/hooks/client/useUser";
import React, { useState, useEffect, useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import useAuthStore from "@/store/useAuthStore";
import FormCreateTurnoAdmin from "../Turnos/FormCreateTurnoAdmin";

const AdminAssigTurn: React.FC = () => {
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const { availabilityData } = useAvailability(selectedProfessional ?? undefined);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentClient | null>(null);
  const [hasAvailableDates, setHasAvailableDates] = useState(false);

  const { userId } = useAuthStore();
  const { usersData } = useUser(false);
  const { appointmentsData } = useAppointmentClient(
    selectedProfessional ?? undefined,
    availabilityData?.find(
      (av) => av.date_all === (selectedDate ? selectedDate.toISOString().split("T")[0] : undefined)
    )?.id
  );

  const turnosSectionRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const startMonth = new Date();
  startMonth.setMonth(today.getMonth());

  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);

  const checkAvailableDates = () => {
    if (!availabilityData) return false;
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    return availabilityData.some((av) => {
      const avDate = new Date(av.date_all);
      return avDate >= today && avDate.getDay() !== 0 && avDate.getDay() !== 6;
    });
  };

  useEffect(() => {
    setHasAvailableDates(checkAvailableDates());
  }, [availabilityData]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedAppointment(null);
  };

  const handleTimeSelect = (appointment: AppointmentClient) => {
    setSelectedAppointment(appointment);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const availableDates = availabilityData?.map((date) => formatDate(new Date(date.date_all))) ?? [];

  useEffect(() => {
    if (usersData && userId) {
      const matchingProfessional = usersData.find(user => user.id === userId);
      if (matchingProfessional) {
        setSelectedProfessional(matchingProfessional.id);
      }
    }
  }, [usersData, userId]);

  return (
    <div className="flex flex-col text-gray-900">
      <section className="py-16 px-6 bg-white text-center" ref={turnosSectionRef}>
        {selectedProfessional ? (
          <>
            <h3 className="text-2xl font-semibold mb-4">
              Elige una Fecha y Hora Disponibles
            </h3>

            {hasAvailableDates ? (
              <div className="flex flex-col items-center mt-8">
                <DayPicker
                  key={selectedProfessional} 
                  selected={selectedDate}
                  onDayClick={handleDateSelect}
                  mode="single"
                  startMonth={startMonth}
                  endMonth={nextMonth}
                  modifiers={{
                    disabled: [
                      (date) => !availableDates.includes(formatDate(date)),
                      (date) => date.getDay() === 0 || date.getDay() === 6,
                      (date) => date < new Date(new Date().setHours(0, 0, 0, 0))
                    ],
                    available: (date) => availableDates.includes(formatDate(date)) && date > today
                  }}
                  modifiersClassNames={{
                    disabled: "bg-gray-100 text-gray-400",
                    available: "bg-prim-100 text-prim-800 font-bold",
                    selected: "bg-prim-500 text-white"
                  }}
                  styles={{
                    day: {
                      transition: "all 0.2s ease-in-out"
                    }
                  }}
                />

                {selectedDate && (
                  <>
                    <div className="mt-6 text-lg">
                      <p>Turnos Disponibles</p>
                      <h2 className="font-bold text-slate-400 text-2xl">
                        {selectedDate?.toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric"
                        })}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                      {appointmentsData?.appointments
                        ?.filter((appointment) => {
                          if (!selectedDate) return false;
                          const appointmentDate = new Date(appointment.date_get);
                          return (
                            formatDate(appointmentDate) === formatDate(selectedDate) &&
                            appointment.state === "nulo"
                          );
                        })
                        .map((appointment) => (
                          <button
                            key={appointment.id}
                            className="bg-prim-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-prim-600 focus:outline-none focus:ring-5 focus:ring-prim-300"
                            onClick={() => handleTimeSelect(appointment)}
                          >
                            {appointment.start_time.slice(0, 5)}
                          </button>
                        ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg max-w-md mx-auto">
                <p className="text-lg text-white p-4 font-bold rounded-2xl bg-red-500">
                  No hay turnos disponibles. Por favor, crea turnos primero.
                </p>
              </div>
            )}

            {selectedProfessional && selectedDate && selectedAppointment && (
              <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogTrigger
                  onClick={() => setOpenModal(true)}
                  className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  Solicitar Turno
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] rounded-lg bg-white p-6 shadow-xl overflow-y-auto">
                  <DialogHeader className="relative">
                    <DialogDescription className="mt-4 space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-lg font-semibold text-blue-800 mb-1">
                          Detalles del Turno
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          {selectedDate?.toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric"
                          })}
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          {selectedAppointment.start_time.slice(0, 5)} hs
                        </p>
                      </div>

                      <FormCreateTurnoAdmin
                        id={selectedAppointment.id}
                        modal={setOpenModal}
                      />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            )}
          </>
        ) : (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg max-w-md mx-auto">
            <p className="text-lg text-white p-4 font-bold rounded-2xl bg-red-500">
              No se encontró el profesional. Por favor, verifica tu usuario.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminAssigTurn;