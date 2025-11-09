import PageHeader from "@/component/PageHeader";
import { useMemo, useState } from "react";
import { useUserApi } from "@/hooks/useUserApi.hook";
import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";
import BarMonthChart from "@/component/ui/BarMonthChart";
import { useUserAnalyticsApi } from "@/hooks/useAnalyticsApi";

export default function AdminDashboardPage() {
  const { useGetAdminUsersChart } = useUserApi();
  const { useGetAdminEstablishmentsChart } = useEstablishmentApi();
  const { data: usersData, isLoading: isUsersLoading } =
    useGetAdminUsersChart();
  const { data: establishmentsData, isLoading: isEstablishmentsLoading } =
    useGetAdminEstablishmentsChart();
  const { data: analyticsData, isLoading: isAnalyticsLoading } =
    useUserAnalyticsApi().useGetAdminAnalyticsChart();

  // Usuarios
  const [usersYear, setUsersYear] = useState<number>(new Date().getFullYear());
  const usersAvailableYears = useMemo(() => {
    const raw = usersData?.data ?? [];
    const years = new Set<number>();
    raw.forEach((u: { createdAt: string }) => {
      const d = new Date(String(u.createdAt));
      if (!isNaN(d.getTime())) years.add(d.getFullYear());
    });
    const arr = Array.from(years).sort((a, b) => b - a);
    return arr.length ? arr : [new Date().getFullYear()];
  }, [usersData]);
  const usersMonthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i,
      label: new Date(2000, i, 1).toLocaleString("es-AR", { month: "short" }),
      count: 0,
    }));
    const currentYear = usersYear;
    const raw = usersData?.data ?? [];
    raw.forEach((u: { createdAt: string }) => {
      const d = new Date(String(u.createdAt));
      if (!isNaN(d.getTime()) && d.getFullYear() === currentYear) {
        months[d.getMonth()].count += 1;
      }
    });
    return months;
  }, [usersData, usersYear]);

  // Establishments
  const [estYear, setEstYear] = useState<number>(new Date().getFullYear());
  const estAvailableYears = useMemo(() => {
    const raw = establishmentsData?.data ?? [];
    const years = new Set<number>();
    raw.forEach((e: { createdAt: string }) => {
      const d = new Date(String(e.createdAt));
      if (!isNaN(d.getTime())) years.add(d.getFullYear());
    });
    const arr = Array.from(years).sort((a, b) => b - a);
    return arr.length ? arr : [new Date().getFullYear()];
  }, [establishmentsData]);
  const estMonthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i,
      label: new Date(2000, i, 1).toLocaleString("es-AR", { month: "short" }),
      count: 0,
    }));
    const currentYear = estYear;
    const raw = establishmentsData?.data ?? [];
    raw.forEach((e: { createdAt: string }) => {
      const d = new Date(String(e.createdAt));
      if (!isNaN(d.getTime()) && d.getFullYear() === currentYear) {
        months[d.getMonth()].count += 1;
      }
    });
    return months;
  }, [establishmentsData, estYear]);

  // Visitas
  const [visitsYear, setVisitsYear] = useState<number>(
    new Date().getFullYear(),
  );
  const visitsAvailableYears = useMemo(() => {
    const raw = analyticsData?.data ?? [];
    const years = new Set<number>();
    raw.forEach((v: { createdAt: string }) => {
      const d = new Date(String(v.createdAt));
      if (!isNaN(d.getTime())) years.add(d.getFullYear());
    });
    const arr = Array.from(years).sort((a, b) => b - a);
    return arr.length ? arr : [new Date().getFullYear()];
  }, [analyticsData]);
  const visitsMonthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i,
      label: new Date(2000, i, 1).toLocaleString("es-AR", { month: "short" }),
      count: 0,
    }));
    const currentYear = visitsYear;
    const raw = analyticsData?.data ?? [];
    raw.forEach((v: { createdAt: string }) => {
      const d = new Date(String(v.createdAt));
      if (!isNaN(d.getTime()) && d.getFullYear() === currentYear) {
        months[d.getMonth()].count += 1;
      }
    });
    return months;
  }, [analyticsData, visitsYear]);

  return (
    <>
      <PageHeader
        title="Panel administrador"
        description="Mirá estadisticas sobre deacá"
        subdescription="Mantenete informado sobre las estadisticas disponibles sobre visitas a la pagina, usuarios o establecimientos registrados"
      />
      <div className="mt-6 flex flex-col gap-8">
        <div>
          <h3 className="text-lg font-semibold">Registros de visitas</h3>
          <BarMonthChart
            year={visitsYear}
            onYearChange={setVisitsYear}
            availableYears={visitsAvailableYears}
            monthlyData={visitsMonthlyData}
            isLoading={isAnalyticsLoading}
            label="Visitas"
            noDataMsg="Sin visitas registradas para {year}"
            loadingMsg="Cargando visitas..."
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Registros de usuarios</h3>
          <BarMonthChart
            year={usersYear}
            onYearChange={setUsersYear}
            availableYears={usersAvailableYears}
            monthlyData={usersMonthlyData}
            isLoading={isUsersLoading}
            label="Usuarios registrados"
            noDataMsg="Sin registros para {year}"
            loadingMsg="Cargando registros..."
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Establecimientos creados</h3>
          <BarMonthChart
            year={estYear}
            onYearChange={setEstYear}
            availableYears={estAvailableYears}
            monthlyData={estMonthlyData}
            isLoading={isEstablishmentsLoading}
            label="Establecimientos"
            noDataMsg="Sin establecimientos creados para {year}"
            loadingMsg="Cargando establecimientos..."
          />
        </div>
      </div>
    </>
  );
}
