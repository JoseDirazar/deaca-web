import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type HeaderGroup,
  type Header,
  type Row,
  type Cell,
  type ColumnDef,
} from "@tanstack/react-table";
import PageHeader from "@/component/PageHeader";
import { useAppReviewsApi } from "@/hooks/useAppReviewsApi.hook";
import { useMemo, useState } from "react";
import Input from "@/component/ui/Input";
import Button from "@/component/ui/Button";
import type { AppReview } from "@/types/reviews/app-review.interface";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { generateImageUrl } from "@/lib/generate-image-url";
import { useQueryClient } from "@tanstack/react-query";
import { parseCommentStatus } from "@/lib/parse-information-to-ui";
import { AppReviewStatus } from "@/types/enums/app-review-status.enum";
import Modal from "@/component/ui/Modal";

export default function AdminCommentsPage() {
  const { useGetAppReviews, useUpdateAppReviewStatus } = useAppReviewsApi();
  const { data: payload, isPending } = useGetAppReviews;
  const updateStatus = useUpdateAppReviewStatus;
  const queryClient = useQueryClient();

  const [currentComment, setCurrentComment] = useState<AppReview | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const allReviews = useMemo(() => payload?.data ?? [], [payload]);

  const filtered = useMemo(() => {
    if (!search) return allReviews;
    const s = search.toLowerCase();
    return allReviews.filter((r) => {
      const name =
        `${r.user?.firstName ?? ""} ${r.user?.lastName ?? ""}`.toLowerCase();
      const email = (r.user?.email ?? "").toLowerCase();
      return (
        (r.comment ?? "").toLowerCase().includes(s) ||
        name.includes(s) ||
        email.includes(s)
      );
    });
  }, [allReviews, search]);

  const handleModal = (comment: AppReview) => {
    setCurrentComment(comment);
    setModalIsOpen(true);
  };

  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const columns = useMemo<ColumnDef<AppReview>[]>(
    () => [
      {
        header: () => <span>Estado</span>,
        accessorKey: "status",
        cell: (info) => {
          const status = info.getValue() as AppReviewStatus;
          return parseCommentStatus(status);
        },
      },
      {
        header: () => <span className="font-semibold">Usuario</span>,
        accessorKey: "user",
        cell: (info) => {
          const u = info.row.original.user;
          return (
            <div className="flex items-center gap-2">
              {u?.avatar ? (
                <img
                  className="h-8 w-8 rounded-full"
                  src={generateImageUrl("user", u.avatar)}
                  alt="Avatar"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200" />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {u?.firstName} {u?.lastName}
                </span>
                <span className="text-xs text-gray-500">{u?.email}</span>
              </div>
            </div>
          );
        },
      },
      {
        header: () => <span className="font-semibold">Comentario</span>,
        accessorKey: "comment",
        cell: (info) => {
          const comment = info.getValue() as string;
          return (
            <button
              onClick={() => handleModal(info.row.original)}
              className="cursor-pointer text-sm text-blue-500 underline"
            >
              {comment.length > 20 ? `${comment.slice(0, 20)}...` : comment}
            </button>
          );
        },
      },
      {
        header: () => <span className="font-semibold">Creado</span>,
        accessorKey: "createdAt",
        cell: (info) =>
          info.getValue()
            ? format(
                new Date(info.getValue() as string),
                "dd/MM/yyyy, HH:mm:ss",
                { locale: es },
              )
            : "",
      },
      {
        header: () => <span className="font-semibold">Acciones</span>,
        id: "actions",
        cell: (info) => {
          const review = info.row.original;
          return (
            <div className="flex gap-2">
              <Button
                className="px-2 py-1 text-xs"
                label="Aprobar"
                disabled={updateStatus.isPending}
                onClick={() =>
                  updateStatus.mutate(
                    { reviewId: review.id, status: AppReviewStatus.APPROVED },
                    {
                      onSuccess: () =>
                        queryClient.invalidateQueries({
                          queryKey: ["app-reviews"],
                        }),
                    },
                  )
                }
              />
              <Button
                className="border border-fourth bg-gray-50 px-2 py-1 text-xs text-fourth"
                label="Rechazar"
                disabled={updateStatus.isPending}
                onClick={() =>
                  updateStatus.mutate(
                    { reviewId: review.id, status: AppReviewStatus.REJECTED },
                    {
                      onSuccess: () =>
                        queryClient.invalidateQueries({
                          queryKey: ["app-reviews"],
                        }),
                    },
                  )
                }
              />
            </div>
          );
        },
      },
    ],
    [updateStatus, queryClient],
  );

  const table = useReactTable({
    data: paged,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: {
      pagination: { pageIndex: page - 1, pageSize: limit },
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Comentarios"
        description={
          filtered.length
            ? `${filtered.length} comentario${filtered.length !== 1 ? "s" : ""}`
            : "No hay comentarios"
        }
      />

      <div className="flex items-center gap-2">
        <Input
          id="admin-comments-search"
          type="text"
          title="Buscar por comentario o usuario..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="h-full rounded border px-2 py-2"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 overflow-x-auto">
          <thead className="bg-gray-50">
            {table
              .getHeaderGroups()
              .map((headerGroup: HeaderGroup<AppReview>) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(
                    (header: Header<AppReview, unknown>) => (
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
          <tbody className="divide-y divide-gray-200 overflow-x-auto bg-white">
            {isPending ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Cargando...
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No hay comentarios
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row: Row<AppReview>) => (
                <tr
                  key={row.id}
                  className="transition-colors duration-150 hover:bg-gray-50"
                >
                  {row
                    .getVisibleCells()
                    .map((cell: Cell<AppReview, unknown>) => (
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
          Página {page} de {totalPages} • {filtered.length} registros
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded border px-3 py-1 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Anterior
          </button>
          <button
            className="rounded border px-3 py-1 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>
      <Modal isOpen={modalIsOpen} setIsOpen={setModalIsOpen}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <img
              className="h-8 w-8 rounded-full"
              src={generateImageUrl("user", currentComment?.user?.avatar)}
              alt="Avatar"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {currentComment?.user?.firstName}{" "}
                {currentComment?.user?.lastName}
              </span>
              <span className="text-xs text-gray-500">
                {currentComment?.user?.email}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {currentComment?.comment}
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
