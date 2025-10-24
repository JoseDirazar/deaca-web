import { useCallback, useMemo } from "react";
import type { SortBy, SortOrder } from "./useUsersFilters.hook";
import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/types/user/user.interface";
import { generateImageUrl } from "@/lib/generate-image-url";
import { es } from "date-fns/locale";
import { format, formatDistanceToNow } from "date-fns";
import type { AccountStatus } from "@/types/common/api-request.interface";
import type { Roles } from "@/types/common/roles.interface";
import {
  parseAccountStatus,
  parseRoleToUI,
} from "@/lib/parse-information-to-ui";

export function useAdminUsersTable({
  state,
  setSorting,
  setOpenModal,
  setCurrentUserStatus,
  setCurrentUser,
  setOpenModal2,
}: {
  state: {
    sortBy: string;
    sortOrder: string;
  };
  setSorting: (sortBy?: SortBy, sortOrder?: SortOrder) => void;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentUserStatus: React.Dispatch<
    React.SetStateAction<{ email: string; status: AccountStatus }>
  >;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  setOpenModal2: React.Dispatch<React.SetStateAction<boolean>>;
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
  //TODO: chequear que todas las tablas traigan y filtren con queries del back
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: () => (
          <button
            onClick={() => toggleSort("status")}
            className="font-semibold"
          >
            Estado
            {renderSortIndicator("status")}
          </button>
        ),
        accessorKey: "status",
        cell: (info) => {
          const user = info.row.original; // objeto completo de la fila
          return (
            <button
              onClick={() => {
                setCurrentUserStatus({
                  email: user.email,
                  status: user.status,
                }); // ← acá obtenés el id
                setOpenModal(true);
              }}
              className="hover:cursor-pointer"
            >
              {parseAccountStatus(info.getValue() as AccountStatus)}
            </button>
          );
        },
      },
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
        cell: (info) => {
          const user = info.row.original;
          return (
            <button
              onClick={() => {
                setCurrentUser(user);
                setOpenModal2(true);
              }}
              className="px-2 py-1 text-xs font-medium hover:cursor-pointer hover:text-primary"
            >
              {info.getValue() as string}
            </button>
          );
        },
      },
      {
        header: () => (
          <button onClick={() => toggleSort("role")} className="font-semibold">
            Rol
            {renderSortIndicator("role")}
          </button>
        ),
        accessorKey: "role",
        cell: (info) => parseRoleToUI(info.getValue() as Roles),
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
    [
      toggleSort,
      renderSortIndicator,
      setCurrentUserStatus,
      setOpenModal,
      setCurrentUser,
      setOpenModal2,
    ],
  );

  return {
    columns,
    toggleSort,
    renderSortIndicator,
  };
}
