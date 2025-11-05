import type { FormattedPharmacies } from "./types";

interface PharmaciesContainerHeaderProps {
  isTomorrow?: boolean;
  pharmaciesData: FormattedPharmacies;
}

export default function PharmaciesContainerHeader({
  isTomorrow,
  pharmaciesData,
}: PharmaciesContainerHeaderProps) {
  return (
    <>
      <p className="font-century-gothic-bold mb-4 text-center text-2xl text-primary">
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
