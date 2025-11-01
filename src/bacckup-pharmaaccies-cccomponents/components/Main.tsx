import { PharmacyData } from "../types";
import ShowCalendarButton from "./ShowCalendarButton";
import Calendar from "./Calendar";
import PharmaciesContainer from "./PharmaciesContainer";
import XDuivider from "./ui/XDivider";
import { getPharmaciesByDay } from "../actions/get-pharmacies-by-date";
import { useGetPharmacies } from "../actions/get-pharmacies";

export default function Main() {
  const {
    pharmaciesDetailsList,
    data,
    setShowAllPharmacies,
    showAllPharmacies,
  } = useGetPharmacies();
  if (!data || !pharmaciesDetailsList) return null;
  return (
    <main className="container mx-auto w-full px-4 py-8">
      <PharmaciesContainer
        pharmaciesData={getPharmaciesByDay(data, pharmaciesDetailsList)}
      />
      <XDuivider />
      <PharmaciesContainer
        pharmaciesData={getPharmaciesByDay(
          data,
          pharmaciesDetailsList,
          "tomorrow",
        )}
        isTomorrow
      />

      <ShowCalendarButton
        data={data as PharmacyData[]}
        showAllPharmacies={showAllPharmacies}
        setShowAllPharmacies={setShowAllPharmacies}
      />
      {showAllPharmacies && data && (
        <Calendar data={data} pharmaciesDetailsList={pharmaciesDetailsList} />
      )}
    </main>
  );
}
