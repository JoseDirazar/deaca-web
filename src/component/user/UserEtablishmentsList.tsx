import type { Establishment } from "@/types/establishment/etablihment.interface";
import Button from "../ui/Button";
import type { Dispatch, SetStateAction } from "react";
import { generateImageUrl } from "@/lib/generate-image-url";

interface UserEstablishmentsListProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  isLoadingMine: boolean;
  myEstablishments: Establishment[] | undefined;
}

export default function UserEstablishmentsList({
  setShowModal,
  isLoadingMine,
  myEstablishments,
}: UserEstablishmentsListProps) {
  if (!myEstablishments) return <div>Aún no tienes establecimientos</div>;
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Mis establecimientos
        </h1>
        <Button
          label="Nuevo establecimiento"
          onClick={() => setShowModal(true)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-3 md:col-span-1">
          {isLoadingMine ? (
            <div className="text-gray-500">Cargando...</div>
          ) : (
            myEstablishments?.map((e: Establishment) => (
              <div key={e.id} className={"rounded border border-gray-200 p-3"}>
                <img
                  src={generateImageUrl("establishment", e.avatar)}
                  className="h-24 w-24 rounded"
                />
                <img
                  src={generateImageUrl(
                    "establishment",
                    e.images?.[0]?.fileName,
                  )}
                  className="h-24 w-24 rounded"
                />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{e.name}</div>
                    <div className="text-sm text-gray-500">{e.address}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-1 text-xs ${e.isComplete ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                    >
                      {e.isComplete ? "Completo" : "Incompleto"}
                    </span>
                    <span
                      className={`rounded px-2 py-1 text-xs ${e.verified ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
                    >
                      {e.verified ? "Verificado" : "Sin verificar"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
