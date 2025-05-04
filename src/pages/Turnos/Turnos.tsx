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
import FormCreateTurno from "./FormCreateTurno";
import { useSearchParams } from "react-router-dom";

const Turnos: React.FC = () => {
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const { availabilityData } = useAvailability(selectedProfessional ?? undefined);
  const [searchParams] = useSearchParams();
  const isMediador = searchParams.get("mediador") === "true";
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentClient | null>(null);
  const [hasAvailableDates, setHasAvailableDates] = useState(false);
  
  const { usersData } = useUser(isMediador);
  const { appointmentsData } = useAppointmentClient(
    selectedProfessional ?? undefined,
    availabilityData?.find(
      (av) => av.date_all === (selectedDate ? selectedDate.toISOString().split("T")[0] : undefined)
    )?.id
  );

  const turnosSectionRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);

  // Función para verificar si hay fechas disponibles para seleccionar
  const checkAvailableDates = () => {
    if (!availabilityData) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return availabilityData.some(av => {
      const avDate = new Date(av.date_all);
      return avDate > today && 
             avDate.getDay() !== 0 && 
             avDate.getDay() !== 6;
    });
  };

  useEffect(() => {
    setHasAvailableDates(checkAvailableDates());
  }, [availabilityData]);

  const handleProfessionalSelect = (professional: string) => {
    setSelectedProfessional(professional);
    setSelectedDate(undefined);
    setSelectedAppointment(null);
    
    // Scroll suave a la sección de turnos después de seleccionar profesional
    setTimeout(() => {
      turnosSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

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

  return (
    <div className="flex flex-col text-gray-900">
      {/* Hero Section */}
      <section className="bg-[url('/hero-bg.jpg')] bg-cover bg-center text-white py-24 px-6 text-center bg-black/60 bg-blend-multiply">
        <h1 className="text-4xl md:text-6xl font-bold mb-2">SIJAC</h1>
        <p className="text-xl tracking-wide mb-6">CONSULTORA</p>
      </section>

      {/* Turnos Section */}
      <section className="py-16 px-6 bg-white text-center" ref={turnosSectionRef}>
        {isMediador ? (
          <h2 className="text-3xl font-bold mb-6 text-prim-500">
            Mediadores Disponibles
          </h2>
        ) : (
          <h2 className="text-3xl font-bold mb-6 text-prim-500">
            Elige un Profesional
          </h2>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
          {usersData?.map((user) => (
            <div
              key={user.id}
              className={`${
                selectedProfessional === user.id
                  ? "bg-prim-500 text-white"
                  : "bg-white text-prim-500"
              } rounded-xl p-6 shadow-sm border border-gray-200 cursor-pointer transition hover:bg-prim-100`}
              onClick={() => handleProfessionalSelect(user.id)}
            >
              {user.url_image ? (
                <img
                  src={user.url_image}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
                />
              ) : (
                <div className="w-24 h-24 mx-auto bg-prim-100 rounded-full mb-4" />
              )}
              <h3 className="font-semibold text-lg">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-sm text-gray-600">{user.specialty}</p>
            </div>
          ))}
        </div>

        {selectedProfessional && (
          <>
            <h3 className="text-2xl font-semibold mb-4">
              Elige una Fecha y Hora Disponibles
            </h3>

            {hasAvailableDates ? (
              <div className="flex flex-col items-center mt-8">
                <DayPicker
                  selected={selectedDate}
                  onDayClick={handleDateSelect}
                  startMonth={today}
                  endMonth={nextMonth}
                  modifiers={{
                    disabled: [
                      (date) => !availableDates.includes(formatDate(date)),
                      (date) => date.getDay() === 0 || date.getDay() === 6,
                      (date) => date <= today,
                    ],
                    available: (date) => {
                      return (
                        availableDates.includes(formatDate(date)) &&
                        date > today
                      );
                    },
                  }}
                  modifiersClassNames={{
                    available: "bg-prim-500 text-white hover:bg-green-400",
                    disabled: "bg-gray-50 text-gray-400 cursor-not-allowed",
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
                          year: "numeric",
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
                  El profesional no tiene turnos disponibles en este momento.
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
                      <p className="text-lg font-semibold text-blue-800 mb-1">Detalles del Turno</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedDate?.toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedAppointment.start_time.slice(0, 5)} hs
                      </p>
                    </div>
            
                    <FormCreateTurno
                      id={selectedAppointment.id}
                      modal={setOpenModal}
                    />
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Turnos;