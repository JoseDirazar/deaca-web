import { useCallback, useMemo } from "react";
import type { SortBy, SortOrder } from "./useUsersFilters.hook";
import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/types/user/user.interface";
import { generateImageUrl } from "@/lib/generate-image-url";
import { es } from "date-fns/locale";
import { format, formatDistanceToNow } from "date-fns";

export function useAdminUsersTable({
  state,
  setSorting,
}: {
  state: {
    sortBy: string;
    sortOrder: string;
  };
  setSorting: (sortBy?: SortBy, sortOrder?: SortOrder) => void;
}) {
  const toggleSort = useCallback(
    (key: string) => {
      if (state.sortBy !== key) {
        setSorting(key as SortBy, "ASC");
      } else {
        setSorting(key as SortBy, state.sortOrder === "ASC" ? "DESC" : "ASC");
      }
    },
    [state.sortBy, state.sortOrder, setSorting],
  );

  const renderSortIndicator = useCallback(
    (key: string) => {
      if (state.sortBy !== key) return null;
      return (
        <span className="ml-1">{state.sortOrder === "ASC" ? "▲" : "▼"}</span>
      );
    },
    [state.sortBy, state.sortOrder],
  );

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: () => <></>,
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
    [toggleSort, renderSortIndicator],
  );

  return {
    columns,
    toggleSort,
    renderSortIndicator,
  };
}
