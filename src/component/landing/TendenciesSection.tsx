import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";
import SectionBody from "../ui/section/SectionBody";
import SectionContainer from "../ui/section/SectionContainer";
import SectionHeader from "../ui/section/SectionHeader";
import type { Establishment } from "@/types/establishment/etablihment.interface";
import { generateImageUrl } from "@/lib/generate-image-url";

export default function TendenciesSection() {
  const { useGetEstablishments } = useEstablishmentApi();
  const { data: establishments } = useGetEstablishments("?limit=3&page=1");
  return (
    <SectionContainer className="flex flex-col items-center justify-center gap-8">
      <SectionHeader title="Tendencias" separator />
      <SectionBody className="flex w-full flex-wrap items-center justify-center gap-4 md:gap-10">
        {establishments?.data?.map((establishment) => (
          <EstablishmentTendencyCard
            key={establishment.id}
            establishment={establishment}
          />
        ))}
      </SectionBody>
    </SectionContainer>
  );
}

function EstablishmentTendencyCard({
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
