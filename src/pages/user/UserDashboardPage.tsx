import PageHeader from "@/component/PageHeader";
import AppReviewForm from "@/component/review/AppReviewForm";
import { useUserStore } from "@/context/useUserStore";
import Button from "@/component/ui/Button";
import { useNavigate } from "react-router";
import { EstablishmentStatus } from "@/types/enums/establishment-status.enum";
import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";
import { useUserAnalyticsApi } from "@/hooks/useAnalyticsApi";
import { useMemo, useState } from "react";
import type { Analytics } from "@/types/analytics.interface";
import BarMonthChart from "@/component/ui/BarMonthChart";

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { data: myEstablishments } =
    useEstablishmentApi().useGetMyEstablishments();

  const hasActiveEstablishment = myEstablishments?.data?.some(
    (e) => e.status === EstablishmentStatus.ACTIVE,
  );

  const { data: totalVisits, isLoading } =
    useUserAnalyticsApi().useGetTotalVisitsForEstablishmentOwner();
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const availableYears = useMemo(() => {
    const raw =
      (totalVisits?.data?.data?.visits as Analytics[] | undefined) ?? [];
    const years = new Set<number>();
    raw.forEach((v) => {
      const d = new Date(String(v.createdAt));
      if (!isNaN(d.getTime())) years.add(d.getFullYear());
    });
    const arr = Array.from(years).sort((a, b) => b - a);
    return arr.length ? arr : [new Date().getFullYear()];
  }, [totalVisits]);

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i,
      label: new Date(2000, i, 1).toLocaleString("es-AR", { month: "short" }),
      count: 0,
    }));
    const currentYear = year;
    const raw =
      (totalVisits?.data?.data?.visits as Analytics[] | undefined) ?? [];
    raw.forEach((v) => {
      const d = new Date(String(v.createdAt));
      if (!isNaN(d.getTime()) && d.getFullYear() === currentYear) {
        months[d.getMonth()].count += 1;
      }
    });
    return months;
  }, [totalVisits, year]);

  if (user?.role === "user") {
    return (
      <div className="flex flex-col items-center justify-center gap-8">
        <PageHeader
          title="Bienvenido!"
          description="Bienvenido al panel de usuario"
          subdescription="Tenes algun emprendimiento o local para registrar? registrate en un simple paso y carga tu emprendimiento/local"
        />
        <Button
          className=""
          label="Registrarme como emprendedor"
          onClick={() => navigate("/registrarme-como-emprendedor")}
        />
      </div>
    );
  }
  return (
    <>
      <PageHeader title="Dashboard" description="Bienvenido al dashboard" />
      {hasActiveEstablishment && <AppReviewForm />}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">
          Visitas{" "}
          <span className="text-sm text-gray-600">
            (total: {totalVisits?.data?.data?.total})
          </span>
        </h3>
        <BarMonthChart
          year={year}
          onYearChange={setYear}
          availableYears={availableYears}
          monthlyData={monthlyData}
          isLoading={isLoading}
          label="Visitas"
          noDataMsg="Sin visitas registradas para {year}"
          loadingMsg="Cargando visitas..."
        />
      </div>
    </>
  );
}
