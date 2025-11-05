import { generateImageUrl } from "@/lib/generate-image-url";
import type { Establishment } from "@/types/establishment/etablihment.interface";

export default function NightLifeListItem({
  // TODO: hacer componente reutilizable con tendencies
  establishment,
}: {
  establishment: Establishment;
}) {
  return (
    <div className="relative z-20 flex aspect-square w-[200px] flex-col items-start justify-end gap-2 px-2 py-1">
      <h2 className="text-2xl text-white">{establishment.name}</h2>

      <img
        className="absolute inset-0 -z-10 h-full w-full rounded object-cover"
        src={generateImageUrl("establishment-logo", establishment.avatar)}
        alt={establishment.name}
      />
    </div>
  );
}
