import { FaLocationDot } from "react-icons/fa6";
import { useState } from "react";
import type { PharmacyData, PharmacyDetail } from "./types";

export default function Calendar({
  data,
  pharmaciesDetailsList,
}: {
  data: PharmacyData[];
  pharmaciesDetailsList: PharmacyDetail[];
}) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const selectedPharmacies = selectedDay
    ? data.find((item) => item.dia_mes === selectedDay)?.farmacias || []
    : [];

  const formatDay = (day: string) => {
    switch (day) {
      case "Dom":
        return <p>Domingo</p>;
      case "Lun":
        return <p>Lunes</p>;
      case "Mar":
        return <p>Martes</p>;
      case "Mié":
        return <p>Miercoles</p>;
      case "Jue":
        return <p>Jueves</p>;
      case "Vie":
        return <p>Viernes</p>;
      case "Sáb":
        return <p>Sabado</p>;
      default:
        return "";
    }
  };
  return (
    <div className="my-4 mt-8 mb-8 rounded-lg bg-fifth p-6 shadow-md">
      <h2 className="font-nueva-bold mb-6 text-2xl font-extrabold text-primary">
        Calendario de Farmacias de Turno
      </h2>

      <div className="mb-6 grid grid-cols-7 gap-2">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <>
            <div
              key={day}
              className="font-century-gothic-bold text-center text-primary md:hidden"
            >
              {day}
            </div>
            <div
              key={`${day}-full`}
              className="font-century-gothic-bold hidden text-center text-primary md:block"
            >
              {formatDay(day)}
            </div>
          </>
        ))}

        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="h-12" />
        ))}

        {days.map((day) => {
          const dayStr = day.toString();
          const hasPharmacies = data.some((item) => item.dia_mes === dayStr);
          const isSelected = selectedDay === dayStr;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(dayStr)}
              className={`group flex h-12 items-center justify-center rounded-lg ${
                hasPharmacies
                  ? "cursor-pointer bg-white hover:bg-secondary hover:ring-1 hover:ring-primary"
                  : "cursor-not-allowed bg-green-500"
              } ${isSelected ? "bg-green-600 ring-2 ring-fourth" : ""} duration-200`}
              disabled={!hasPharmacies}
            >
              <span
                className={`font-century-gothic-bold group-hover:text-fourth ${
                  isSelected ? "text-fourth" : "text-third/50"
                }`}
              >
                {day}
              </span>
            </button>
          );
        })}
      </div>

      {selectedDay && selectedPharmacies.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-4 text-xl font-extrabold text-primary">
            Farmacias de turno el día {selectedDay}
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {selectedPharmacies.map((farmacia, index) => {
              const mapsQuery = encodeURIComponent(
                `${farmacia.nombre}, ${farmacia.direccion}`,
              );
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
              const direccion =
                pharmaciesDetailsList.find(
                  (detail) =>
                    detail.nombre
                      .split(" ")
                      .slice(1)
                      .join(" ")
                      .toLowerCase() === farmacia.nombre.toLowerCase(),
                )?.direccion ||
                farmacia.direccion ||
                "";
              return (
                <div
                  key={index}
                  className="font-century-gothic-bold flex flex-col items-center justify-between gap-1 rounded-md bg-secondary p-6 text-center"
                >
                  <div className="mb-4 flex items-center justify-center rounded-lg bg-fourth px-3 py-2 shadow-sm">
                    <p className="font-century-gothic-bold text-lg text-white">
                      {farmacia.nombre}
                    </p>
                  </div>
                  <p className="text-lg text-third text-shadow-black">
                    {direccion}
                  </p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-2 rounded-lg bg-fifth px-4 py-4 text-white shadow-lg ring-2 ring-primary hover:bg-third hover:ring-fourth"
                  >
                    <FaLocationDot
                      size={42}
                      className="inline-block text-primary group-hover:text-fourth"
                    />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
