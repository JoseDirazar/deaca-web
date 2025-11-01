import { generateImageUrl } from "@/lib/generate-image-url";
import type { Event } from "@/types/event/event.interface";
import { FaEdit, FaTrash } from "react-icons/fa";
import Button from "../ui/Button";
import { useEventApi } from "@/hooks/useEventApi.hook";

export default function AdminEventListItem({
  event,
  navigate,
}: {
  event: Event;
  navigate: (edit?: "edit" | null) => void;
}) {
  const { useDeleteEvent } = useEventApi();
  const deleteEvent = useDeleteEvent;

  const handleDelete = () => {
    if (
      window.confirm(`¿Estás seguro de eliminar el evento "${event.name}"?`)
    ) {
      deleteEvent.mutate(event.id);
    }
  };

  return (
    <div className="relative container flex h-fit rounded-md bg-gray-50 shadow-md">
      {event.image && (
        <img
          src={generateImageUrl("event-logo", event.image)}
          className="h-40 w-40 rounded-l-md object-cover"
          alt={`Avatar de ${event.name}`}
        />
      )}
      {!event.image && (
        <div className="flex h-40 w-40 items-center justify-center rounded-l-md bg-gray-200">
          <span className="text-gray-400">Sin imagen</span>
        </div>
      )}

      <div className="flex flex-col justify-between gap-2 p-3">
        <div className="flex w-full flex-col gap-2">
          <button
            className="w-fit text-lg font-extrabold hover:underline"
            onClick={() => navigate()}
          >
            {event.name}
          </button>
          <p className="text-sm text-gray-500">
            {event.description.split(" ").length > 14
              ? `${event.description.split(" ").slice(0, 14).join(" ")}...`
              : event.description}
          </p>
          <div className="flex gap-2 text-xs text-gray-500">
            <span>Inicio: {new Date(event.start).toLocaleDateString()}</span>
            <span>Fin: {new Date(event.end).toLocaleDateString()}</span>
            {event.price !== null && <span>Precio: ${event.price}</span>}
          </div>
        </div>
        <span className="text-xs text-gray-500">
          Creado: {new Date(event.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="absolute top-1 right-1 mt-2 flex items-center justify-center gap-1">
        <Button
          onClick={() => navigate("edit")}
          className="text-xs"
          label="Editar"
          icon={<FaEdit />}
        />
        <Button
          onClick={handleDelete}
          className="bg-red-500 text-xs hover:bg-red-600"
          label="Eliminar"
          icon={<FaTrash />}
          disabled={deleteEvent.isPending}
        />
      </div>
    </div>
  );
}
