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
import type { User } from "@/types/user/user.interface";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { generateImageUrl } from "@/lib/generate-image-url";
import Input from "@/component/ui/Input";
import { useUserApi } from "@/hooks/useUserApi.hook";

export default function AdminUsersPage() {
  const { state, queryString, setPage, setLimit, setSearch, setSorting } =
    useUsersFilters();
  const { useGetUsers } = useUserApi();
  const {
    data: paginatedUsers,
    isPending: isLoadingUsers,
    isError: isGetUsersError,
    error: getUsersError,
  } = useGetUsers(
    queryString,
    state.page,
    state.limit,
    state.sortBy ?? "createdAt",
    state.sortOrder ?? "DESC",
  );

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: () => (
          <button
            onClick={() => toggleSort("avatar")}
            className="font-semibold"
          >
            Nombre
            {renderSortIndicator("avatar")}
          </button>
        ),
        accessorKey: "avatar",
        cell: (info) => (
          <img
            className="h-10 w-10 rounded-full"
            src={generateImageUrl("user", info.getValue() as string)}
            alt="Avatar"
          />
        ),
      },
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
            ? format(
                new Date(info?.getValue() as string),
                "dd/MM/yyyy, HH:mm:ss",
                {
                  locale: es,
                },
              )
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
            ? formatDistanceToNow(new Date(info?.getValue() as string), {
                addSuffix: true,
                locale: es,
              })
            : "",
      },
    ],
    [state.sortBy, state.sortOrder],
  );

  const table = useReactTable({
    data: paginatedUsers?.data ?? [],
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
    <div className="space-y-4 bg-gray-50 p-4">
      <h1 className="font-century-gothic-bold text-xl font-bold text-fourth">
        Usuarios
      </h1>

      <div className="flex items-center gap-2">
        <Input
          id="admin-user-search"
          type="text"
          title="Buscar por nombre o email..."
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

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<User>) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: Header<User, unknown>) => (
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
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoadingUsers ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Cargando...
                </td>
              </tr>
            ) : paginatedUsers?.data?.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No hay usuarios
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row: Row<User>) => (
                <tr
                  key={row.id}
                  className="transition-colors duration-150 hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell: Cell<User, unknown>) => (
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

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Página {paginatedUsers?.meta?.currentPage ?? state.page} de{" "}
          {paginatedUsers?.meta?.totalPages ?? 1} •{" "}
          {paginatedUsers?.meta?.totalItems ?? paginatedUsers?.data?.length}{" "}
          registros
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded border px-3 py-1 disabled:opacity-50"
            onClick={() =>
              setPage(
                Math.max(
                  1,
                  (paginatedUsers?.meta?.currentPage ?? state.page) - 1,
                ),
              )
            }
            disabled={(paginatedUsers?.meta?.currentPage ?? state.page) <= 1}
          >
            Anterior
          </button>
          <button
            className="rounded border px-3 py-1 disabled:opacity-50"
            onClick={() =>
              setPage(
                Math.min(
                  paginatedUsers?.meta?.totalPages ?? 1,
                  (paginatedUsers?.meta?.currentPage ?? state.page) + 1,
                ),
              )
            }
            disabled={
              (paginatedUsers?.meta?.currentPage ?? state.page) >=
              (paginatedUsers?.meta?.totalPages ?? 1)
            }
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
