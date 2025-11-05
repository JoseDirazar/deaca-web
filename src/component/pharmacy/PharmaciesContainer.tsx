import PharmaciesContainerHeader from "./PharmaciesContainerHeader";
import PharmaciesList from "./PharmaciesList";
import type { FormattedPharmacies } from "./types";

interface PharmaciesContainerProps {
  pharmaciesData: FormattedPharmacies | null;
  isTomorrow?: boolean;
}
export default function PharmaciesContainer({
  pharmaciesData,
  isTomorrow,
}: PharmaciesContainerProps) {
  if (!pharmaciesData) return null;
  return (
    <div className="mx-auto mb-8 w-full rounded-lg border-l-4 border-primary bg-fifth p-6 px-10 shadow-md xs:px-14 sm:px-18">
      <PharmaciesContainerHeader
        isTomorrow={isTomorrow}
        pharmaciesData={pharmaciesData}
      />
      <PharmaciesList pharmaciesData={pharmaciesData} />
    </div>
  );
}
