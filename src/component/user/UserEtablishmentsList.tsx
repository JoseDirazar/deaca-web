import type { Establishment } from "@/types/establishment/etablihment.interface";

import UserEstablishmentsListItem from "../establishment/UserEstablishmentsListItem";
import { useNavigate } from "react-router";

interface UserEstablishmentsListProps {
  myEstablishments: Establishment[] | undefined;
}

export default function UserEstablishmentsList({
  myEstablishments,
}: UserEstablishmentsListProps) {
  const navigate = useNavigate();
  if (!myEstablishments) return <div>Aún no tienes establecimientos</div>;
  return (
    <div className="flex h-full w-full flex-col gap-6">
      {myEstablishments?.map((e) => (
        <UserEstablishmentsListItem
          key={e.id}
          establishment={e}
          navigate={(edit?: "edit" | null) =>
            navigate(
              edit
                ? `/usuario/emprendimientos/${e.slug}`
                : `/emprendimientos/${e.slug}`,
              { state: { from: location.pathname } },
            )
          }
        />
      ))}
    </div>
  );
}
