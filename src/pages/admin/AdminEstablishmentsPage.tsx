import { useMemo } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type HeaderGroup,
  type Header,
  type Row,
  type Cell,
} from "@tanstack/react-table";
import { useEstablishmentsFilters } from "@/hooks/useEstablishmentsFilters.hook";
import { useGetPaginatedEstablishments } from "@/hooks/useEstablishments.hook";
import type { Establishment } from "@/types/establishment/etablihment.interface";
import type { SortBy } from "@/hooks/useEstablishmentsFilters.hook";

export default function EstablishmentsTable() {
  const { state, queryString, setPage, setLimit, setName, setAddress, setSorting } =
    useEstablishmentsFilters();

  const { establishments, meta, isLoading } =
    useGetPaginatedEstablishments(queryString);

  const columns = useMemo<ColumnDef<Establishment>[]>(
    () => [
      {
        header: ({ column }) => (
          <button
            className="flex items-center font-semibold hover:text-blue-600"
            onClick={() => toggleSort("name")}
          >
            Nombre
            {renderSortIndicator("name")}
          </button>
        ),
        accessorKey: "name",
        cell: (info) => info.getValue() as string,
      },
      {
        header: ({ column }) => (
          <button
            className="flex items-center font-semibold hover:text-blue-600"
            onClick={() => toggleSort("address")}
          >
            Dirección
            {renderSortIndicator("address")}
          </button>
        ),
        accessorKey: "address",
        cell: (info) => info.getValue() as string,
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: (info) => (
          <a
            href={`mailto:${info.getValue()}`}
            className="text-blue-600 hover:underline"
          >
            {info.getValue() as string}
          </a>
        ),
      },
      {
        header: "Teléfono",
        accessorKey: "phone",
        cell: (info) => (
          <a
            href={`tel:${info.getValue()}`}
            className="text-blue-600 hover:underline"
          >
            {info.getValue() as string}
          </a>
        ),
      },
      {
        header: ({ column }) => (
          <button
            className="flex items-center font-semibold hover:text-blue-600"
            onClick={() => toggleSort("createdAt")}
          >
            Creado
            {renderSortIndicator("createdAt")}
          </button>
        ),
        accessorKey: "createdAt",
        cell: (info) => {
          const value = info.getValue();
          return value
            ? new Date(String(value)).toLocaleString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";
        },
      },
    ],
    [state.sortBy, state.sortOrder],
  );

  const table = useReactTable({
    data: establishments || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: meta?.totalPages ?? 1,
    state: {
      pagination: {
        pageIndex: (state.page ?? 1) - 1,
        pageSize: state.limit ?? 10,
      },
    },
  });

  function toggleSort(key: SortBy) {
    if (state.sortBy !== key) {
      setSorting(key, "ASC");
    } else {
      setSorting(key, state.sortOrder === "ASC" ? "DESC" : "ASC");
    }
  }

  function renderSortIndicator(key: SortBy) {
    if (state.sortBy !== key) return null;
    return (
      <span className="ml-1 text-xs">
        {state.sortOrder === "ASC" ? "▲" : "▼"}
      </span>
    );
  }

  const currentPage = meta?.currentPage ?? state.page ?? 1;
  const totalPages = meta?.totalPages ?? 1;
  const totalItems = meta?.totalItems ?? establishments?.length ?? 0;

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Establecimientos</h1>
        <div className="text-sm text-gray-500">
          {totalItems} establecimiento{totalItems !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Filtros y controles */}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex-1 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={state.name || ""}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Filtrar por dirección..."
            value={state.address || ""}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="limit" className="text-sm font-medium text-gray-700">
            Mostrar:
          </label>
          <select
            id="limit"
            className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            value={state.limit ?? 10}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table
                .getHeaderGroups()
                .map((headerGroup: HeaderGroup<Establishment>) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(
                      (header: Header<Establishment, unknown>) => (
                        <th
                          key={header.id}
                          className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </th>
                      ),
                    )}
                  </tr>
                ))}
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
                      <span>Cargando establecimientos...</span>
                    </div>
                  </td>
                </tr>
              ) : !establishments || establishments.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <svg
                        className="h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <span className="text-lg font-medium">
                        No se encontraron establecimientos
                      </span>
                      {state.name && (
                        <span className="text-sm">
                          Intenta con un término de búsqueda diferente
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row: Row<Establishment>) => (
                  <tr
                    key={row.id}
                    className="transition-colors duration-150 hover:bg-gray-50"
                  >
                    {row
                      .getVisibleCells()
                      .map((cell: Cell<Establishment, unknown>) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 text-sm whitespace-nowrap text-gray-900"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      <div className="flex flex-col items-center justify-between gap-4 px-2 sm:flex-row">
        <div className="text-sm text-gray-600">
          Mostrando página {currentPage} de {totalPages} • {totalItems}{" "}
          registros en total
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1 || isLoading}
          >
            ← Anterior
          </button>

          {/* Números de página */}
          <div className="hidden items-center space-x-1 sm:flex">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  disabled={isLoading}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages || isLoading}
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}
