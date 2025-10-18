import type { Establishment } from "@/types/establishment/etablihment.interface";

import UserEstablishmentsListItem from "../establishment/UserEstablishmentsListItem";
import { useNavigate } from "react-router";
import CardSkeleton from "../ui/CardSkeleton";

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
  if (isLoadingMine) return <CardSkeleton />;
  return (
    <div className="flex h-full w-full flex-col gap-6">
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
