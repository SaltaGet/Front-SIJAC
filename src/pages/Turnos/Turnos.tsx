import {
  AppointmentClient,
  useAppointmentClient,
} from "@/hooks/client/useAppointmentClient";
import { useAvailability } from "@/hooks/useAvailability";
import { useUser } from "@/hooks/useUser";
import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormCreateTurno from "./FormCreateTurno";

const Turnos: React.FC = () => {
  const [selectedProfessional, setSelectedProfessional] = useState<
    string | null
  >(null);
  const { availabilityData } = useAvailability(
    selectedProfessional ?? undefined
  );

  const [openModal, setOpenModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentClient | null>(null); // Estado para la hora seleccionada
  const { usersData } = useUser();
  const { appointmentsData } = useAppointmentClient(
    selectedProfessional ?? undefined,
    availabilityData?.find(
      (av) =>
        av.date_all ===
        (selectedDate ? selectedDate.toISOString().split("T")[0] : undefined)
    )?.id
  );

  // Obtener la fecha actual y la fecha del próximo mes
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);

  const handleProfessionalSelect = (professional: string) => {
    setSelectedProfessional(professional);
    setSelectedDate(undefined); // Reset date selection when changing professional
    setSelectedAppointment(null); // Reset time selection when changing professional
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedAppointment(null); // Reset time selection when changing date
  };

  const handleTimeSelect = (appointment: AppointmentClient) => {
    setSelectedAppointment(appointment);
  };

  // Función para comparar las fechas sin considerar la hora
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]; // Esto devuelve la fecha en formato "YYYY-MM-DD"
  };

  // Convierte las fechas de availabilityData a un formato comparable (YYYY-MM-DD)
  const availableDates =
    availabilityData?.map((date) => formatDate(new Date(date.date_all))) ?? [];

  return (
    <div className="flex flex-col text-gray-900">
      {/* Hero Section */}
      <section className="bg-[url('/hero-bg.jpg')] bg-cover bg-center text-white py-24 px-6 text-center bg-black/60 bg-blend-multiply">
        <h1 className="text-4xl md:text-6xl font-bold mb-2">SIJAC</h1>
        <p className="text-xl tracking-wide mb-6">CONSULTORA</p>
      </section>

      {/* Turnos Section */}
      <section className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold mb-6 text-prim-500">
          Elige un Profesional
        </h2>
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
              <div className="w-24 h-24 mx-auto bg-prim-100 rounded-full mb-4" />
              <h3 className="font-semibold text-lg">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-sm text-gray-600">Especialidad</p>
            </div>
          ))}
        </div>

        <h3 className="text-2xl font-semibold mb-4">
          {selectedProfessional} - Elige una fecha y hora Disponibles
        </h3>

        {selectedProfessional && (
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
                ],
                available: (date) => availableDates.includes(formatDate(date)),
              }}
              modifiersClassNames={{
                available: "bg-prim-300 text-white hover:bg-green-400",
              }}
            />

            {selectedDate && (
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
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {appointmentsData?.appointments
                ?.filter((appointment) => {
                  if (!selectedDate) return false;

                  const appointmentDate = new Date(appointment.date_get);
                  const selectedDateFormatted = formatDate(selectedDate);
                  const appointmentDateFormatted = formatDate(appointmentDate);

                  return (
                    appointmentDateFormatted === selectedDateFormatted &&
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
          </div>
        )}

        {/* Mostrar detalles seleccionados */}
        {selectedProfessional && selectedDate && selectedAppointment && (
          <Dialog open={openModal}>
            <DialogTrigger onClick={() => setOpenModal(true)} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
              Solicitar Turno
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Turno</DialogTitle>
                <DialogDescription>
                  <p className="mt-2">Profesional: {selectedProfessional}</p>
                  <p className="mt-2 font-bold">
                    {selectedDate?.toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="mt-2">
                    Hora: {selectedAppointment.start_time.slice(0, 5)}
                  </p>
                  <FormCreateTurno id={selectedAppointment.id} modal={setOpenModal}/>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </section>
    </div>
  );
};

export default Turnos;
