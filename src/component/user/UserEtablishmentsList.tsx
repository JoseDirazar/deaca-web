import type { Establishment } from "@/types/establishment/etablihment.interface";
import Button from "../ui/Button";
import type { Dispatch, SetStateAction } from "react";
import { generateImageUrl } from "@/lib/generate-image-url";
import { useState } from "react";
import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";

interface UserEstablishmentsListProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  isLoadingMine: boolean;
  myEstablishments: Establishment[] | undefined;
  onEdit: (establishment: Establishment) => void;
}

export default function UserEstablishmentsList({
  setShowModal,
  isLoadingMine,
  myEstablishments,
  onEdit,
}: UserEstablishmentsListProps) {
  const { deleteEstablishment } = useEstablishmentApi();
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
                <div className="mb-3 flex gap-2">
                  <img
                    src={generateImageUrl("establishment", e.avatar)}
                    className="h-24 w-24 rounded object-cover"
                    alt={`Avatar de ${e.name}`}
                  />
                  {e.images?.[0] && (
                    <img
                      src={generateImageUrl(
                        "establishment",
                        e.images[0].fileName,
                      )}
                      className="h-24 w-24 rounded object-cover"
                      alt={`Imagen de ${e.name}`}
                    />
                  )}
                </div>
                <div>
                  <div className="font-semibold">{e.name}</div>
                  <div className="text-sm text-gray-500">{e.address}</div>
                </div>
                <div className="mt-2 flex items-center gap-2">
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
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => onEdit(e)}
                    className="flex-1 rounded bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setDeletingId(e.id)}
                    className="flex-1 rounded bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
                
                {deletingId === e.id && (
                  <div className="mt-3 rounded border border-red-300 bg-red-50 p-3">
                    <p className="mb-2 text-sm text-red-800">
                      ¿Estás seguro de que deseas eliminar este establecimiento?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          deleteEstablishment.mutate(e.id, {
                            onSuccess: () => setDeletingId(null)
                          });
                        }}
                        disabled={deleteEstablishment.isPending}
                        className="flex-1 rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        {deleteEstablishment.isPending ? "Eliminando..." : "Sí, eliminar"}
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="flex-1 rounded bg-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-400"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
