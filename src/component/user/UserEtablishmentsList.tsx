import type { Establishment } from "@/types/establishment/etablihment.interface";

import { EstablishmentListItem } from "../ui/establishment/EstablishmentListItem";
import { useNavigate } from "react-router";

interface UserEstablishmentsListProps {
  isLoadingMine: boolean;
  myEstablishments: Establishment[] | undefined;
}

export default function UserEstablishmentsList({
  isLoadingMine,
  myEstablishments,
}: UserEstablishmentsListProps) {
  const navigate = useNavigate();
  if (!myEstablishments) return <div>Aún no tienes establecimientos</div>;
  if (isLoadingMine) return <div>Cargando...</div>;
  return (
    <div className="m-3 mx-auto grid h-full w-full grid-cols-1 gap-6 p-3 md:grid-cols-2">
      {myEstablishments?.map((e) => (
        <EstablishmentListItem
          key={e.id}
          establishment={e}
          navigate={(edit?: "edit" | null) =>
            navigate(
              edit ? `/user/establishment/${e.id}` : `/establishment/${e.id}`,
              { state: { from: location.pathname } },
            )
          }
        />
      ))}
    </div>
  );
}
