import { FormattedPharmacies } from "../types";
import PharmacyCard from "./PharmacyCard";

interface PharmaciesContainerProps {
  pharmaciesData: FormattedPharmacies;
  title?: string;
  isTomorrow?: boolean;
}
export default function PharmaciesContainer({
  pharmaciesData,
  isTomorrow,
}: PharmaciesContainerProps) {
  return (
    <>
      {pharmaciesData && (
        <div className="mx-auto mb-8 w-full rounded-lg border-l-4 border-primary bg-fifth p-6 px-10 shadow-md xs:px-14 sm:px-18">
          <PharmaciesContainerHeader
            isTomorrow={isTomorrow}
            pharmaciesData={pharmaciesData}
          />
          <PharmaciesList pharmaciesData={pharmaciesData} />
        </div>
      )}
    </>
  );
}

function PharmaciesList({
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

function PharmaciesContainerHeader({
  isTomorrow,
  pharmaciesData,
}: {
  isTomorrow?: boolean;
  pharmaciesData: FormattedPharmacies;
}) {
  return (
    <>
      <p className="mb-4 text-center font-century-gothic-bold text-2xl text-primary">
        {isTomorrow ? "Mañana" : "Hoy"} {pharmaciesData?.dia_mes}/
        {new Date().getMonth() + 1}
      </p>
      <div className="mb-4 w-full text-center text-xl font-extrabold tracking-wider text-third/50">
        {isTomorrow && (
          <p className="font-century-gothic-bold text-sm">
            Abierto a partir de 8:30 hs
          </p>
        )}
      </div>
    </>
  );
}
