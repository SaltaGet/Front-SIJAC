import dayjs from "dayjs";
import "dayjs/locale/es"; // importa el idioma español

dayjs.locale("es"); // configura dayjs en español

export function formatearFecha(fecha: string): string {
  return dayjs(fecha, "M/D/YYYY").format("D [de] MMMM [de] YYYY");
}
