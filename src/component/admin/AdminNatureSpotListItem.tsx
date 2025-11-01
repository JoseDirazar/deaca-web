import { generateImageUrl } from "@/lib/generate-image-url";
import type { NatureSpot } from "@/types/nature-spot/nature-spot.interface";
import { FaEdit, FaTrash } from "react-icons/fa";
import Button from "../ui/Button";
import { useNatureSpotApi } from "@/hooks/useNatureSpotApi.hook";

export default function AdminNatureSpotListItem({
  natureSpot,
  navigate,
}: {
  natureSpot: NatureSpot;
  navigate: (edit?: "edit" | null) => void;
}) {
  const { useDeleteNatureSpot } = useNatureSpotApi();
  const deleteNatureSpot = useDeleteNatureSpot;

  const handleDelete = () => {
    if (
      window.confirm(
        `¿Estás seguro de eliminar el paseo natural "${natureSpot.name}"?`,
      )
    ) {
      deleteNatureSpot.mutate(natureSpot.id);
    }
  };

  return (
    <div className="relative container flex h-fit rounded-md bg-gray-50 shadow-md">
      {natureSpot.image && (
        <img
          src={generateImageUrl("nature-spot-logo", natureSpot.image)}
          className="h-40 w-40 rounded-l-md object-cover"
          alt={`Avatar de ${natureSpot.name}`}
        />
      )}
      {!natureSpot.image && (
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
            {natureSpot.name}
          </button>
          <p className="text-sm text-gray-500">
            {natureSpot.description.split(" ").length > 14
              ? `${natureSpot.description.split(" ").slice(0, 14).join(" ")}...`
              : natureSpot.description}
          </p>
          <div className="flex gap-2 text-xs text-gray-500">
            <span>
              Coord: {natureSpot.latitude}, {natureSpot.longitude}
            </span>
          </div>
        </div>
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
          disabled={deleteNatureSpot.isPending}
        />
      </div>
    </div>
  );
}
