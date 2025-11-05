import { generateImageUrl } from "@/lib/generate-image-url";
import type { NatureSpot } from "@/types/nature-spot/nature-spot.interface";

export default function NatureSpotListItem({
  natureSpot,
}: {
  natureSpot: NatureSpot;
}) {
  return (
    <div className="flex flex-col gap-4 text-center">
      <img
        src={generateImageUrl("nature-spot-logo", natureSpot.image)}
        alt={natureSpot.name}
        className="h-54 w-full object-cover"
      />
      <h2 className="font-century-gothic text-3xl font-bold">
        {natureSpot.name}
      </h2>
      <p className="text-lg">
        {natureSpot.description.length > 300
          ? natureSpot.description.slice(0, 300) + "..."
          : natureSpot.description}
      </p>
    </div>
  );
}
