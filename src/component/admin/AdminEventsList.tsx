import type { Event } from "@/types/event/event.interface";
import AdminEventListItem from "./AdminEventListItem";
import { useNavigate } from "react-router";

interface AdminEventsListProps {
  events: Event[] | undefined;
}

export default function AdminEventsList({
  events,
}: AdminEventsListProps) {
  const navigate = useNavigate();
  if (!events || events.length === 0)
    return <div>Aún no hay eventos registrados</div>;
  return (
    <div className="flex h-full w-full flex-col gap-6">
      {events?.map((event) => (
        <AdminEventListItem
          key={event.id}
          event={event}
          navigate={(edit?: "edit" | null) =>
            navigate(
              `/admin/eventos/${event.id}`,
              { state: { from: location.pathname } },
            )
          }
        />
      ))}
    </div>
  );
}

