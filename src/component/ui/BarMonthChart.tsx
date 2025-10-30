import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface MonthDatum {
  month: number;
  label: string;
  count: number;
}
interface BarMonthChartProps {
  year: number;
  onYearChange: (y: number) => void;
  availableYears: number[];
  monthlyData: MonthDatum[];
  isLoading: boolean;
  label?: string;
  noDataMsg?: string;
  loadingMsg?: string;
  // Custom chart settings (dataset, styling, etc)
  styleOptions?: {
    backgroundColor?: string;
    borderColor?: string;
    hoverBackgroundColor?: string;
    chartLabel?: string;
  };
}

export default function BarMonthChart({
  year,
  onYearChange,
  availableYears,
  monthlyData,
  isLoading,
  label = "Registros",
  noDataMsg = "Sin datos para el año seleccionado",
  loadingMsg = "Cargando...",
  styleOptions = {},
}: BarMonthChartProps) {
  const hasData = useMemo(() => monthlyData.some((m) => m.count > 0), [monthlyData]);

  const chartData = useMemo(
    () => ({
      labels: monthlyData.map((m) => m.label),
      datasets: [
        {
          label: styleOptions.chartLabel || label,
          data: monthlyData.map((m) => m.count),
          backgroundColor: styleOptions.backgroundColor || `oklch(59.26% 0.13591 48.309)`,
          borderColor: styleOptions.borderColor || `oklch(72.42% 0.11394 50.366)`,
          borderWidth: 1,
          borderRadius: 4,
          hoverBackgroundColor: styleOptions.hoverBackgroundColor || `oklch(72.42% 0.11394 50.366)`,
        },
      ],
    }),
    [monthlyData, styleOptions, label],
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: `oklch(93.72% 0.00692 88.613)`,
          titleColor: "oklch(72.42% 0.11394 50.366)",
          bodyColor: "oklch(72.42% 0.11394 50.366)",
          borderColor: `oklch(72.42% 0.11394 50.366)`,
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
        },
      },
    }),
    [],
  );
  return (
    <div>
      <div className="mt-3 flex items-center gap-2">
        <label htmlFor="year" className="text-sm text-gray-600">
          Año
        </label>
        <select
          id="year"
          className="rounded border px-2 py-1 text-sm"
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
        >
          {availableYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4 h-64">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
            {loadingMsg}
          </div>
        ) : hasData ? (
          <Bar data={chartData} options={chartOptions} className="rounded bg-gray-50 p-2" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
            {noDataMsg.replace("{year}", String(year))}
          </div>
        )}
      </div>
    </div>
  );
}
