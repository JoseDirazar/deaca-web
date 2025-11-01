import { useState } from "react";
import { usePharmacies } from "@/hooks/usePharmacies";
import PharmaciesContainer from "./PharmaciesContainer";
import { getPharmaciesByDay } from "./get-pharmacies-by-date";
import Calendar from "./Calendar";
import ShowCalendarButton from "./ShowCalendarButton";
import XDivider from "./ui/XDivider";
import type { PharmacyData, PharmacyDetailData } from "./types";

export default function PharmaciesPreview() {
  const { data, loading, error } = usePharmacies();
  const [showAllPharmacies, setShowAllPharmacies] = useState(false);

  if (loading) return <div>Cargando farmacias...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return <div>Sin datos</div>;

  const monthData = (data.farmacias_por_dia || []) as PharmacyData[];
  const details = (data.detalle_farmacias || []) as PharmacyDetailData[];

  const today = getPharmaciesByDay(monthData, details, "today");
  const tomorrow = getPharmaciesByDay(monthData, details, "tomorrow");

  return (
    <div className="container mx-auto w-full px-0 py-0">
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
