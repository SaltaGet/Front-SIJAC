import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

// ✅ acepta Date directamente
export function formatearFecha(fecha: Date): string {
  return dayjs(fecha).format("D [de] MMMM [de] YYYY");
}
