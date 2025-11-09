import PageHeader from "@/component/PageHeader";
import AppReviewForm from "@/component/review/AppReviewForm";
import { useUserStore } from "@/context/useUserStore";
import Button from "@/component/ui/Button";
import { useNavigate } from "react-router";
import { useMemo, useState, useEffect } from "react";
import { EstablishmentStatus } from "@/types/enums/establishment-status.enum";
import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";
import { useUserAnalyticsApi } from "@/hooks/useAnalyticsApi";
import { toast } from "sonner";
import type { Analytics } from "@/types/analytics.interface";
import BarMonthChart from "@/component/ui/BarMonthChart";
import type { Establishment } from "@/types/establishment/etablihment.interface";

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const { user } = useUserStore();

  // Use a try-catch with a default empty array to prevent unhandled rejections
  let myEstablishments: Establishment[] = [];
  try {
    const result = useEstablishmentApi().useGetMyEstablishments();
    myEstablishments = result.data?.data || { data: [] };
  } catch (error) {
    console.error("Error fetching establishments:", error);
    // Don't show error toast here as it might be expected for regular users
  }

  const hasActiveEstablishment = myEstablishments?.some(
    (e: Establishment) => e.status === EstablishmentStatus.ACTIVE,
  );

  // Only fetch analytics if user has the right role
  const [totalVisits, setTotalVisits] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const analyticsApi = useUserAnalyticsApi();
  const {
    data: analyticsData,
    error,
    isLoading: isAnalyticsLoading,
  } = analyticsApi.useGetTotalVisitsForEstablishmentOwner();

  console.log("Analytics data:", analyticsData);

  useEffect(() => {
    if (user?.role !== "user" && analyticsData) {
      setTotalVisits(analyticsData);
    }
  }, [analyticsData, user?.role]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Error al cargar las estadísticas");
    }
  }, [error]);

  // Update loading state based on analytics loading state
  useEffect(() => {
    setIsLoading(isAnalyticsLoading);
  }, [isAnalyticsLoading]);

  const availableYears = useMemo(() => {
    const raw = totalVisits?.data?.visits ?? [];
    const years = new Set<number>();
    raw.forEach((v: any) => {
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

    if (!totalVisits) return months;

    const currentYear = year;
    const raw = totalVisits?.data?.visits ?? [];
    raw.forEach((v: any) => {
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
  console.log(hasActiveEstablishment);
  return (
    <>
      <PageHeader title="Dashboard" description="Bienvenido al dashboard" />
      {true && <AppReviewForm />}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">
          Visitas{" "}
          {totalVisits?.data?.total !== undefined && (
            <span className="text-sm text-gray-600">
              (total: {totalVisits.data.total})
            </span>
          )}
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
