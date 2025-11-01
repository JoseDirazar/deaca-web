import type { NatureSpot } from "@/types/nature-spot/nature-spot.interface";
import AdminNatureSpotListItem from "./AdminNatureSpotListItem";
import { useNavigate } from "react-router";

interface AdminNatureSpotsListProps {
  natureSpots: NatureSpot[] | undefined;
}

export default function AdminNatureSpotsList({
  natureSpots,
}: AdminNatureSpotsListProps) {
  const navigate = useNavigate();
  if (!natureSpots || natureSpots.length === 0)
    return <div>Aún no hay paseos naturales registrados</div>;
  return (
    <div className="flex h-full w-full flex-col gap-6">
      {natureSpots?.map((natureSpot) => (
        <AdminNatureSpotListItem
          key={natureSpot.id}
          natureSpot={natureSpot}
          navigate={(edit?: "edit" | null) =>
            navigate(
              edit
                ? `/admin/paseos-naturales/${natureSpot.id}`
                : `/admin/paseos-naturales/${natureSpot.id}`,
              { state: { from: location.pathname } },
            )
          }
        />
      ))}
    </div>
  );
}

