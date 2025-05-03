import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

export function formatearFecha(fecha: string): string {
  return dayjs(fecha, "D/M/YYYY").format("D [de] MMMM [de] YYYY");
}
