import { FaLocationDot } from "react-icons/fa6";

export default function PharmacyCard({
  nombre,
  direccion = "Dirección no disponible",
  className = "",
}: {
  nombre: string;
  direccion?: string;
  className?: string;
}) {
  const mapsQuery = encodeURIComponent(`Farmacia ${nombre}, ${direccion}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  return (
    <div
      className={`flex flex-1 flex-col items-center justify-between gap-7 rounded-lg bg-secondary p-8 shadow-lg sm:gap-4 sm:py-4 lg:gap-8 lg:py-8 ${className}`}
    >
      <div className="flex flex-col items-center justify-start gap-2 md:gap-4">
        <div className="flex w-full max-w-[180px] items-center justify-center rounded-lg bg-fourth px-4 py-3 text-center drop-shadow-md">
          <p className="font-century-gothic-bold text-2xl text-white text-shadow-black">
            {nombre}
          </p>
        </div>
        <p className="font-century-gothic-bold text-center text-xl text-third sm:text-base md:text-2xl">
          {direccion}
        </p>
      </div>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group rounded-lg bg-fifth px-4 py-3 text-white shadow-lg ring-2 ring-primary transition-colors hover:bg-third hover:ring-fourth"
      >
        <FaLocationDot
          size={42}
          className="text-primary transition-colors group-hover:text-fourth"
        />
      </a>
    </div>
  );
}
