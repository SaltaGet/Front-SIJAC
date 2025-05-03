import apiSijac from "@/api/sijac";
import useAuthStore from "@/store/useAuthStore";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface Schedule {
  date_all: string;
  start_time: string;
  end_time: string;
}
interface Availability {
  id: string;
  date_all: string;
  start_time: string;
  end_time: string;
  disponibility: boolean;
}

const postAvailability = async (schedule: Schedule) => {
  const token = useAuthStore.getState().token;
  const { data } = await apiSijac.post("/availability/create", schedule, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

const fetchAvailability = async (ctx: QueryFunctionContext) => {
  const [_, id] = ctx.queryKey;
  void _;
  const { data } = await apiSijac.get<Availability[]>(`/availability/get_all/${id}`);
  return data;
};

export function useAvailability(idUser?: string) {
  const { data: availabilityData, refetch: refetchAvailability } = useQuery({
    queryKey: ["availability", idUser],
    queryFn: fetchAvailability,
    enabled: Boolean(idUser),
  });

  const [isPendingCreate, setIsPendingCreate] = useState(false);

  const createAvailability = async (schedules: Schedule[]) => {
    try {
      setIsPendingCreate(true);
      const results = await Promise.allSettled(
        schedules.map((schedule) => postAvailability(schedule))
      );
  
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          console.log(`Disponibilidad creada [${index}]:`, result.value);
        } else {
          console.error(`Error al crear disponibilidad [${index}]:`, result.reason);
        }
      });
  
      const allSuccessful = results.every(result => result.status === "fulfilled");
  
      if (allSuccessful) {
        alert("Turnos creados correctamente");
      }
  
      refetchAvailability();
    } finally {
      setIsPendingCreate(false);
    }
  };
  

  const takenDays = availabilityData ? availabilityData.map(a => a.date_all) : [];

  return {
    createAvailability,
    isPendingCreate,
    availabilityData,
    refetchAvailability,
    takenDays,
  };
}
