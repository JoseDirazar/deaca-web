import { useState } from "react";
import { usePharmacies } from "@/hooks/usePharmacies";
import PharmaciesContainer from "./PharmaciesContainer";
import { getPharmaciesByDay } from "./get-pharmacies-by-date";
import Calendar from "./Calendar";
import ShowCalendarButton from "./ShowCalendarButton";
import XDivider from "./ui/XDivider";
import type { PharmacyData, PharmacyDetail } from "./types";
import GoogleMaps from "../GoogleMaps";

export default function PharmaciesPreview() {
  const { data, loading, error } = usePharmacies();
  const [showAllPharmacies, setShowAllPharmacies] = useState(false);

  if (loading) return <div>Cargando farmacias...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return <div>Sin datos</div>;

  const monthData = (data.farmacias_por_dia || []) as PharmacyData[];
  const details = (data.detalle_farmacias || []) as PharmacyDetail[];

  const today = getPharmaciesByDay(monthData, details, "today");
  const tomorrow = getPharmaciesByDay(monthData, details, "tomorrow");

  const markers =
    today?.farmacias
      .map((farmacia) => {
        const match = findDetailMatch(farmacia.nombre, details);
        if (!match) return null;
        const lat = Number(match.lat);
        const lng = Number(match.lng);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          return { lat, lng, title: match.nombre, address: match.direccion };
        }
        return null;
      })
      .filter((item) => item !== null) || [];

  return (
    <div className="container mx-auto w-full px-0 py-0">
      {markers.length > 0 && (
        <GoogleMaps markers={markers} className="my-8 h-88 w-full" />
      )}
      <PharmaciesContainer pharmaciesData={today} />
      <XDivider />
      <PharmaciesContainer pharmaciesData={tomorrow} isTomorrow />
      <ShowCalendarButton
        data={monthData}
        showAllPharmacies={showAllPharmacies}
        setShowAllPharmacies={setShowAllPharmacies}
      />

      {showAllPharmacies && monthData && (
        <Calendar data={monthData} pharmaciesDetailsList={details} />
      )}
    </div>
  );
}

// helpers dentro del mismo archivo o importados desde utils
function normalizeName(s?: string) {
  if (!s) return "";
  return s
    .normalize("NFD") // separar acentos
    .replace(/[\u0300-\u036f]/g, "") // quitar diacríticos
    .replace(/[^a-z0-9\s]/gi, "") // quitar puntuación
    .replace(/\b(farmacia|dr|sr|sra|srta)\b/gi, "") // quitar palabras comunes
    .trim()
    .toLowerCase();
}

function findDetailMatch(nombreFromDay: string, details: PharmacyDetail[]) {
  const target = normalizeName(nombreFromDay);

  // 1) igualdad normalizada
  let match = details.find((d) => normalizeName(d.nombre) === target);
  if (match) return match;

  // 2) inclusión (detail contiene el target)
  match = details.find((d) => normalizeName(d.nombre).includes(target));
  if (match) return match;

  // 3) inclusion inversa (target contiene parte del detalle)
  match = details.find((d) => target.includes(normalizeName(d.nombre)));
  if (match) return match;

  // 4) comparar tokens: al menos 1 token en común y longitud de token razonable
  const tokens = target.split(/\s+/).filter(Boolean);
  if (tokens.length) {
    match = details.find((d) => {
      const dTokens = normalizeName(d.nombre).split(/\s+/).filter(Boolean);
      const common = tokens.filter((t) => dTokens.includes(t));
      return common.length >= 1; // ajustar a 1 o 2 si querés más estricto
    });
    if (match) return match;
  }

  // 5) fallback: startsWith
  match = details.find(
    (d) =>
      normalizeName(d.nombre).startsWith(target) ||
      target.startsWith(normalizeName(d.nombre)),
  );
  return match ?? null;
}
