import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type HeaderGroup,
  type Header,
  type Row,
  type Cell,
} from "@tanstack/react-table";
import { useUsersFilters } from "@/hooks/filters/useUsersFilters.hook";
import type { User } from "@/types/user/user.interface";
import Input from "@/component/ui/Input";
import { useUserApi } from "@/hooks/useUserApi.hook";
import PageHeader from "@/component/PageHeader";
import { useAdminUsersTable } from "@/hooks/filters/useAdminUsersTable";
import Modal from "@/component/ui/Modal";
import { useState } from "react";
import Button from "@/component/ui/Button";
import { generateImageUrl } from "@/lib/generate-image-url";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { AccountStatus } from "@/types/enums/account-status.enum";

export default function AdminUsersPage() {
  const { state, queryString, setPage, setLimit, setSearch, setSorting } =
    useUsersFilters();
  const { useGetUsers, changeUserAccountStatus, promoteUserToAdmin } =
    useUserApi();
  const [currentUserStatus, setCurrentUserStatus] = useState({
    email: "",
    status: AccountStatus.ACTIVE,
  });
  const [isConfirmingPromoteStatus, setIsConfirmingPromoteStatus] =
    useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const { data: paginatedUsers, isPending: isLoadingUsers } =
    useGetUsers(queryString);

  const { columns } = useAdminUsersTable({
    state: {
      sortBy: state.sortBy ?? "createdAt",
      sortOrder: state.sortOrder ?? "DESC",
    },
    setSorting,
    setOpenModal,
    setCurrentUserStatus,
    setCurrentUser,
    setOpenModal2,
  });

  const table = useReactTable({
    data: paginatedUsers?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: {
      pagination: { pageIndex: (state.page ?? 1) - 1, pageSize: state.limit },
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Usuarios"
        description="Gestiona usuarios."
        subdescription="presiona en el estado de algun usuario para cambiarlo, presiona sobre el email para ver el detalle del usuario o promoverlo a administrador"
      />

      <div className="flex items-center gap-2">
        <Input
          id="admin-user-search"
          type="text"
          title="Buscar por nombre o email..."
          value={state.search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="h-full rounded border px-2 py-2"
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

      <Modal isOpen={openModal} setIsOpen={setOpenModal}>
        <div className="flex flex-col gap-8">
          <div className="text-2xl font-semibold">
            Cambiar estado de {currentUserStatus.email}
          </div>
          <select
            value={currentUserStatus.status}
            className="rounded px-3 py-2 shadow-md"
            onChange={(e) =>
              setCurrentUserStatus({
                ...currentUserStatus,
                status: e.target.value as AccountStatus,
              })
            }
          >
            <option value={AccountStatus.ACTIVE}>Activo</option>
            <option value={AccountStatus.INACTIVE}>Inactivo</option>
            <option value={AccountStatus.PENDING}>Pendiente</option>
          </select>
          <div className="flex w-full items-center justify-end gap-4">
            <Button
              className="border border-fourth bg-gray-50 text-fourth"
              onClick={() => setOpenModal(false)}
              label="Cancelar"
            />
            <Button
              className=""
              onClick={() => {
                changeUserAccountStatus.mutate({
                  email: currentUserStatus.email,
                  status: currentUserStatus.status,
                });
                setOpenModal(false);
              }}
              label="Cambiar"
              disabled={!currentUserStatus.email || !currentUserStatus.status}
            />
          </div>
        </div>
      </Modal>
      <Modal isOpen={openModal2} setIsOpen={setOpenModal2}>
        <div className="flex flex-col gap-4">
          <div className="text-2xl font-semibold">
            Información de {currentUser?.email}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img
                className="h-10 w-10 rounded-full"
                src={generateImageUrl("user", currentUser?.avatar as string)}
                alt="Avatar"
              />
              <div className="flex flex-col">
                <div className="font-semibold">
                  {currentUser?.firstName} {currentUser?.lastName}
                </div>
                <div className="text-sm text-gray-500">
                  {currentUser?.email}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-semibold">Rol</div>
              <div>{currentUser?.role}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-semibold">Creado</div>
              <div>
                {currentUser?.createdAt
                  ? format(
                      new Date(currentUser?.createdAt),
                      "dd/MM/yyyy, HH:mm:ss",
                      { locale: es },
                    )
                  : ""}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-semibold">Último acceso</div>
              <div>
                {currentUser?.lastLogin
                  ? formatDistanceToNow(new Date(currentUser?.lastLogin), {
                      addSuffix: true,
                      locale: es,
                    })
                  : ""}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-semibold">Estado</div>
              <div>{currentUser?.status}</div>
            </div>
          </div>
          <div className="flex w-full items-center justify-end gap-4">
            {isConfirmingPromoteStatus ? (
              <>
                <p className="text-bold text-center text-red-500">
                  ¿Estas seguro de promover a {currentUser?.email} a
                  administrador? esta acción no se puede deshacer!
                </p>
                <Button
                  className="border border-fourth bg-gray-50 text-fourth"
                  onClick={() => setOpenModal2(false)}
                  label="Cancelar"
                />
                <Button
                  className=""
                  onClick={() => {
                    promoteUserToAdmin.mutate({
                      email: currentUser?.email as string,
                    });
                    setOpenModal2(false);
                  }}
                  label="Confirmar"
                  disabled={!currentUser?.email || promoteUserToAdmin.isPending}
                />
              </>
            ) : (
              <Button
                className=""
                onClick={() => {
                  setIsConfirmingPromoteStatus(true);
                }}
                label="Promover a administrador"
                disabled={!currentUser?.email || promoteUserToAdmin.isPending}
              />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
