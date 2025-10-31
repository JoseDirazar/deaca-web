import { useCallback, useMemo, useState } from "react";
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
import type { Establishment } from "@/types/establishment/etablihment.interface";
import {
  useEstablishmentsFilters,
  type SortBy,
} from "@/hooks/filters/useEstablishmentsFilters.hook";
import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";
import PageHeader from "@/component/PageHeader";
import Modal from "@/component/ui/Modal";
import { EstablishmentStatus } from "@/types/enums/establishment-status.enum";
import Button from "@/component/ui/Button";
import { useNavigate } from "react-router";
import { parseEstablishmentStatus } from "../../lib/parse-information-to-ui";

export default function EstablishmentsTable() {
  const navigate = useNavigate();
  const {
    state,
    queryString,
    setPage,
    setLimit,
    setSearch,
    setAddress,
    setSorting,
  } = useEstablishmentsFilters();

  const { useGetEstablishments, changeEstablishmentStatus } =
    useEstablishmentApi();

  const { data, isPending } = useGetEstablishments(queryString);
  console.log(data?.data);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEstablishment, setCurrentEstablishment] = useState<{
    id: string;
    status: EstablishmentStatus;
    name: string;
  } | null>(null);

  const toggleSort = useCallback(
    (key: SortBy) => {
      if (state.sortBy !== key) {
        setSorting(key, "ASC");
      } else {
        setSorting(key, state.sortOrder === "ASC" ? "DESC" : "ASC");
      }
    },
    [state.sortBy, state.sortOrder, setSorting],
  );

  const renderSortIndicator = useCallback(
    (key: SortBy) => {
      if (state.sortBy !== key) return null;
      return (
        <span className="ml-1 text-xs">
          {state.sortOrder === "ASC" ? "▲" : "▼"}
        </span>
      );
    },
    [state.sortBy, state.sortOrder],
  );

  const handleModal = (establishment: Establishment) => {
    setCurrentEstablishment({
      id: establishment.id,
      status: establishment.status,
      name: establishment.name,
    });
    setIsModalOpen(true);
  };

  const columns = useMemo<ColumnDef<Establishment>[]>(
    () => [
      {
        header: () => (
          <button
            className="flex items-center font-semibold hover:text-blue-600"
            onClick={() => toggleSort("status")}
          >
            Estado
            {renderSortIndicator("status")}
          </button>
        ),
        accessorKey: "status",
        cell: (info) => {
          const establishment = info.row.original;
          return (
            <>
              <button
                className="hover:cursor-pointer"
                onClick={() => handleModal(establishment)}
              >
                {parseEstablishmentStatus(
                  info.getValue() as EstablishmentStatus,
                )}
              </button>
            </>
          );
        },
      },
      {
        header: () => (
          <button
            className="flex items-center font-semibold hover:text-blue-600"
            onClick={() => toggleSort("name")}
          >
            Nombre
            {renderSortIndicator("name")}
          </button>
        ),
        accessorKey: "name",
        cell: (info) => {
          const establishment = info.row.original;

          return (
            <>
              <button
                onClick={() => navigate(`/emprendimientos/${establishment.id}`)}
                className="px-2 py-1 text-xs font-medium hover:cursor-pointer hover:text-primary"
              >
                {info.getValue() as string}
              </button>
            </>
          );
        },
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
        header: () => (
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
    [renderSortIndicator, toggleSort, navigate],
  );

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: data?.meta?.totalPages ?? 1,
    state: {
      pagination: {
        pageIndex: (state.page ?? 1) - 1,
        pageSize: state.limit ?? 10,
      },
    },
  });

  const currentPage = data?.meta?.currentPage ?? state.page ?? 1;
  const totalPages = data?.meta?.totalPages ?? 1;
  const totalItems = data?.meta?.totalItems ?? data?.data?.length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Emprendimientos"
        description="Gestioná los emprendimientos."
        subdescription=" Presiona sobre el nombre para ver el emprendimiento/local.
        Presiona sobre el estado para cambiarlo o sobre el email para enviar un correo."
      />

      {/* Filtros y controles */}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="grid w-full flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={state.search || ""}
            onChange={(e) => setSearch(e.target.value)}
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
              {isPending ? (
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
              ) : !data?.data || data?.data.length === 0 ? (
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
                      {state.search && (
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
            disabled={currentPage <= 1 || isPending}
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
                  disabled={isPending}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages || isPending}
          >
            Siguiente →
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <div className="flex flex-col gap-8">
          <div className="text-2xl font-semibold">
            Cambiar estado de {currentEstablishment?.name}
          </div>
          <select
            value={currentEstablishment?.status}
            className="rounded px-3 py-2 shadow-md"
            onChange={(e) =>
              setCurrentEstablishment((prev) => ({
                id: prev?.id as string,
                name: prev?.name as string,
                status: e.target.value as EstablishmentStatus,
              }))
            }
          >
            <option value={EstablishmentStatus.ACTIVE}>Activo</option>
            <option value={EstablishmentStatus.INACTIVE}>Inactivo</option>
            <option value={EstablishmentStatus.PENDING}>Pendiente</option>
          </select>
          <div className="flex w-full items-center justify-end gap-4">
            <Button
              className="border border-fourth bg-gray-50 text-fourth"
              onClick={() => setIsModalOpen(false)}
              label="Cancelar"
            />
            <Button
              className=""
              onClick={() => {
                if (currentEstablishment?.id && currentEstablishment?.status) {
                  changeEstablishmentStatus.mutate({
                    id: currentEstablishment?.id,
                    status: currentEstablishment?.status,
                  });
                  setIsModalOpen(false);
                }
              }}
              label="Cambiar"
              disabled={
                !currentEstablishment?.id || !currentEstablishment?.status
              }
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
