import { generateImageUrl } from "@/lib/generate-image-url";
import type { Establishment } from "@/types/establishment/etablihment.interface";
import { FaEdit } from "react-icons/fa";
import Button from "../Button";

export function EstablishmentListItem({
  establishment,
  navigate,
}: {
  establishment: Establishment;
  navigate: (edit?: "edit" | null) => void;
}) {
  return (
    <div className="relative container flex h-fit rounded-md bg-fifth shadow-md">
      <img
        src={generateImageUrl("establishment", establishment.avatar)}
        className="h-40 w-40 rounded-l-md object-cover"
        alt={`Avatar de ${establishment.name}`}
      />

      <div className="flex flex-col justify-between gap-2 p-3">
        <div className="flex w-full flex-col gap-2">
          <button
            className="w-fit text-lg font-extrabold hover:underline"
            onClick={() => navigate()}
          >
            {establishment.name}
          </button>
          <p className="text-sm text-gray-500">
            {establishment.description.split(" ").length > 20
              ? `${establishment.description.split(" ").slice(0, 20).join(" ")}...`
              : establishment.description}
          </p>
        </div>
        <div className="text-sm text-gray-500">{establishment.address}</div>
      </div>
      <div className="absolute right-1 bottom-1 mt-2 flex items-center justify-center gap-1">
        <span
          className={`rounded px-2 py-1 text-xs ${establishment.isComplete ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
        >
          {establishment.isComplete ? "Completo" : "Incompleto"}
        </span>
        <span
          className={`rounded px-2 py-1 text-xs ${establishment.verified ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
        >
          {establishment.verified ? "Verificado" : "Sin verificar"}
        </span>
      </div>
      {navigate && (
        <Button
          onClick={() => navigate("edit")}
          className="absolute top-1 right-1 text-xs"
          label="Editar"
          icon={<FaEdit />}
        />
      )}
    </div>
  );
}
