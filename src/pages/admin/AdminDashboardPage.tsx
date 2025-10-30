import PageHeader from "@/component/PageHeader";
import { useMemo, useState } from "react";
import { useUserApi } from "@/hooks/useUserApi.hook";
import BarMonthChart from "@/component/ui/BarMonthChart";

export default function AdminDashboardPage() {
  const { useGetAdminUsersChart } = useUserApi();
  const { data, isLoading } = useGetAdminUsersChart();

  const [year, setYear] = useState<number>(new Date().getFullYear());

  const availableYears = useMemo(() => {
    const raw = (data?.data as { createdAt: string }[]) ?? [];
    const years = new Set<number>();
    raw.forEach((u) => {
      const d = new Date(String(u.createdAt));
      if (!isNaN(d.getTime())) years.add(d.getFullYear());
    });
    const arr = Array.from(years).sort((a, b) => b - a);
    return arr.length ? arr : [new Date().getFullYear()];
  }, [data]);

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i,
      label: new Date(2000, i, 1).toLocaleString("es-AR", { month: "short" }),
      count: 0,
    }));
    const currentYear = year;
    const raw = (data?.data as { createdAt: string }[]) ?? [];
    raw.forEach((u) => {
      const d = new Date(String(u.createdAt));
      if (!isNaN(d.getTime()) && d.getFullYear() === currentYear) {
        months[d.getMonth()].count += 1;
      }
    });
    return months;
  }, [data, year]);

  return (
    <>
      <PageHeader
        title="Panel admin"
        description="Dashboard de registros de usuarios"
      />
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Registros de usuarios</h3>
        <BarMonthChart
          year={year}
          onYearChange={setYear}
          availableYears={availableYears}
          monthlyData={monthlyData}
          isLoading={isLoading}
          label="Registros"
          noDataMsg="Sin registros para {year}"
          loadingMsg="Cargando registros..."
        />
      </div>
    </>
  );
}
