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
import { useUsersFilters } from "@/hooks/useUsersFilters.hook";
import { useGetPaginatedUsers } from "@/hooks/useUsers.hook";
import type { User } from "@/types/user/user.interface";

export default function AdminUsersPage() {
  const { state, queryString, setPage, setLimit, setSearch, setSorting } =
    useUsersFilters();
  const { users, meta, isLoading } = useGetPaginatedUsers(queryString);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: () => (
          <button
            onClick={() => toggleSort("firstName")}
            className="font-semibold"
          >
            Nombre
            {renderSortIndicator("firstName")}
          </button>
        ),
        accessorKey: "firstName",
        cell: (info) => info.getValue() as string,
      },
      {
        header: () => (
          <button
            onClick={() => toggleSort("lastName")}
            className="font-semibold"
          >
            Apellido
            {renderSortIndicator("lastName")}
          </button>
        ),
        accessorKey: "lastName",
        cell: (info) => info.getValue() as string,
      },
      {
        header: () => (
          <button onClick={() => toggleSort("email")} className="font-semibold">
            Email
            {renderSortIndicator("email")}
          </button>
        ),
        accessorKey: "email",
        cell: (info) => info.getValue() as string,
      },
      {
        header: () => (
          <button onClick={() => toggleSort("role")} className="font-semibold">
            Rol
            {renderSortIndicator("role")}
          </button>
        ),
        accessorKey: "role",
        cell: (info) => String(info.getValue() ?? ""),
      },
      {
        header: () => (
          <button
            onClick={() => toggleSort("createdAt")}
            className="font-semibold"
          >
            Creado
            {renderSortIndicator("createdAt")}
          </button>
        ),
        accessorKey: "createdAt",
        cell: (info) =>
          info.getValue()
            ? new Date(String(info.getValue())).toLocaleString()
            : "",
      },
      {
        header: () => (
          <button
            onClick={() => toggleSort("lastLogin")}
            className="font-semibold"
          >
            Último acceso
            {renderSortIndicator("lastLogin")}
          </button>
        ),
        accessorKey: "lastLogin",
        cell: (info) =>
          info.getValue()
            ? new Date(String(info.getValue())).toLocaleString()
            : "",
      },
    ],
    [state.sortBy, state.sortOrder],
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: {
      pagination: { pageIndex: (state.page ?? 1) - 1, pageSize: state.limit },
    },
  });

  function toggleSort(key: any) {
    if (state.sortBy !== key) {
      setSorting(key, "ASC");
    } else {
      setSorting(key, state.sortOrder === "ASC" ? "DESC" : "ASC");
    }
  }

  function renderSortIndicator(key: any) {
    if (state.sortBy !== key) return null;
    return (
      <span className="ml-1">{state.sortOrder === "ASC" ? "▲" : "▼"}</span>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-bold">Usuarios</h1>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={state.search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 rounded border px-3 py-2"
        />
        <select
          className="rounded border px-2 py-2"
          value={state.limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="borde h-fullr overflow-x-auto rounded">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<User>) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: Header<User, unknown>) => (
                  <th key={header.id} className="p-2 text-left">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center">
                  Cargando...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center">
                  No hay usuarios
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row: Row<User>) => (
                <tr key={row.id} className="border-t">
                  {row.getVisibleCells().map((cell: Cell<User, unknown>) => (
                    <td key={cell.id} className="p-2">
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

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Página {meta?.currentPage ?? state.page} de {meta?.totalPages ?? 1} •{" "}
          {meta?.totalItems ?? users.length} registros
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded border px-3 py-1 disabled:opacity-50"
            onClick={() =>
              setPage(Math.max(1, (meta?.currentPage ?? state.page) - 1))
            }
            disabled={(meta?.currentPage ?? state.page) <= 1}
          >
            Anterior
          </button>
          <button
            className="rounded border px-3 py-1 disabled:opacity-50"
            onClick={() =>
              setPage(
                Math.min(
                  meta?.totalPages ?? 1,
                  (meta?.currentPage ?? state.page) + 1,
                ),
              )
            }
            disabled={
              (meta?.currentPage ?? state.page) >= (meta?.totalPages ?? 1)
            }
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
