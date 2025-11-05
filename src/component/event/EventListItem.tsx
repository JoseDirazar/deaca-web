import type { Event } from "@/types/event/event.interface";
import { generateImageUrl } from "@/lib/generate-image-url";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function EventListItem({ event }: { event: Event }) {
  return (
    <div className="flex justify-between overflow-hidden rounded-lg shadow-md">
      <div className="flex w-full flex-col items-start justify-between p-2">
        <div className="flex flex-col gap-4">
          <h2 className="font-century-gothic text-4xl font-bold">
            {event.name}
          </h2>
          <p className="font-century-gothic text-xl">{event.description}</p>
        </div>
        <div className="flex w-full items-center justify-end">
          <p className="flex items-center justify-end text-3xl text-gray-500">
            {format(new Date(event.time), "HH:mm", { locale: es })}
          </p>
        </div>
      </div>
      <img
        src={generateImageUrl("event-logo", event.image)}
        alt={event.name}
        className="w-54 object-cover"
      />
    </div>
  );
}
