import PharmacyCard from "./PharmacyCard";
import type { FormattedPharmacies } from "./types";

export default function PharmaciesList({
  pharmaciesData,
}: {
  pharmaciesData: FormattedPharmacies;
}) {
  return (
    <div className="itens-center grid grid-cols-1 justify-around gap-6 select-none sm:grid-cols-2 lg:flex lg:flex-row lg:flex-wrap">
      {pharmaciesData?.farmacias.map((farmacia, index) => (
        <PharmacyCard
          key={index}
          nombre={farmacia.nombre}
          direccion={farmacia.direccion}
        />
      ))}
    </div>
  );
}
