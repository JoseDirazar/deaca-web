import type { Establishment } from "@/types/establishment/etablihment.interface";

import UserEstablishmentsListItem from "../ui/establishment/UserEstablishmentsListItem";
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
        <UserEstablishmentsListItem
          key={e.id}
          establishment={e}
          navigate={(edit?: "edit" | null) =>
            navigate(
              edit
                ? `/usuario/emprendimientos/${e.id}`
                : `/emprendimientos/${e.id}`,
              { state: { from: location.pathname } },
            )
          }
        />
      ))}
    </div>
  );
}
