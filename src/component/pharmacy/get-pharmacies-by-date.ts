import type { FormattedPharmacies, PharmacyData, PharmacyDetailData } from "./types";

function resolveDireccion(nombre: string, details: PharmacyDetailData[]): string {
  const direct = details.find((d) => d.nombre.toLowerCase() === nombre.toLowerCase());
  if (direct?.direccion) return direct.direccion;
  const alt = details.find(
    (d) =>
      d.nombre
        .split(" ")
        .slice(1)
        .join(" ")
        .toLowerCase() === nombre.toLowerCase(),
  );
  return alt?.direccion ?? "";
}

export function getPharmaciesByDay(
  data: PharmacyData[],
  details: PharmacyDetailData[],
  when: "today" | "tomorrow" = "today",
): FormattedPharmacies | null {
  if (!data?.length) return null;
  const now = new Date();
  if (when === "tomorrow") now.setDate(now.getDate() + 1);
  const dayStr = String(now.getDate());
  const dayData = data.find((d) => d.dia_mes === dayStr);
  if (!dayData) return null;
  return {
    dia_mes: dayData.dia_mes,
    farmacias: (dayData.farmacias || []).map((f) => ({
      nombre: f.nombre,
      direccion: resolveDireccion(f.nombre, details),
    })),
  };
}
