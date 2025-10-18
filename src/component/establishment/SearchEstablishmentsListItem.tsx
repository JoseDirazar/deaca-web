import { generateImageUrl } from "@/lib/generate-image-url";
import type { Establishment } from "@/types/establishment/etablihment.interface";
import { useNavigate } from "react-router";

export default function UserEstablishmentsListItem({
  establishment,
}: {
  establishment: Establishment;
}) {
  const navigate = useNavigate();
  return (
    <div className="relative flex h-fit rounded-md bg-gray-50 shadow-md">
      <img
        src={generateImageUrl("establishment-logo", establishment.avatar)}
        className="h-40 w-40 rounded-l-md object-cover"
        alt={`Avatar de ${establishment.name}`}
      />

      <div className="flex flex-col justify-between gap-2 p-3">
        <div className="flex w-full flex-col gap-2">
          <button
            className="w-fit text-lg font-extrabold hover:underline"
            onClick={() => navigate(`/emprendimientos/${establishment.id}`)}
          >
            {establishment.name}
          </button>
          <p className="text-sm text-wrap text-gray-500">
            {establishment?.description?.split(" ").length > 14
              ? `${establishment?.description?.split(" ").slice(0, 14).join(" ")}...`
              : establishment?.description}
          </p>
        </div>
        <div className="text-sm text-gray-500">{establishment.address}</div>
      </div>
    </div>
  );
}
