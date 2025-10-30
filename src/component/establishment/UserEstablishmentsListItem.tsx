import { generateImageUrl } from "@/lib/generate-image-url";
import type { Establishment } from "@/types/establishment/etablihment.interface";
import { FaEdit } from "react-icons/fa";
import Button from "../ui/Button";
import { parseEstablishmentStatus } from "@/lib/parse-information-to-ui";

export default function UserEstablishmentsListItem({
  establishment,
  navigate,
}: {
  establishment: Establishment;
  navigate: (edit?: "edit" | null) => void;
}) {
  return (
    <div className="relative container flex h-fit rounded-md bg-gray-50 shadow-md">
      <img
        src={generateImageUrl("establishment-logo", establishment.avatar)}
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
            {establishment.description.split(" ").length > 14
              ? `${establishment.description.split(" ").slice(0, 14).join(" ")}...`
              : establishment.description}
          </p>
        </div>
        <span className="text-xs text-gray-500">
          Visto {establishment.visits?.length || 0}{" "}
          {establishment.visits?.length === 1 ? "vez" : "veces"}
        </span>
      </div>
      <div className="absolute right-1 bottom-1 mt-2 flex items-center justify-center gap-1">
        {parseEstablishmentStatus(establishment.status)}
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
