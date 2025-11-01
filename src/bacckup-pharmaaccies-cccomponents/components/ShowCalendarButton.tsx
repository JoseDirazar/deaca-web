import { PharmacyData } from "../types";

export default function ShowCalendarButton({
  showAllPharmacies,
  data,
  setShowAllPharmacies,
}: {
  showAllPharmacies: boolean;
  data: PharmacyData[];
  setShowAllPharmacies: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="flex w-full items-center justify-center">
      {showAllPharmacies && data ? (
        <button
          onClick={() => setShowAllPharmacies(false)}
          className="my-4 mt-4 rounded-lg bg-fifth px-6 py-2 text-xl font-extrabold text-primary transition-colors hover:bg-secondary"
        >
          Cerrar
        </button>
      ) : (
        <button
          onClick={() => setShowAllPharmacies(true)}
          className="mt-4 flex items-center justify-center rounded-lg bg-fifth px-6 py-2 transition-colors hover:bg-secondary"
        >
          <img src="/search.svg" alt="search icon" width={40} height={40} />
          <p className="ml-3 text-xl font-extrabold text-primary">
            Ver calendario
          </p>
        </button>
      )}
    </div>
  );
}
