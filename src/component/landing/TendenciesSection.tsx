import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";
import SectionBody from "../ui/section/SectionBody";
import SectionContainer from "../ui/section/SectionContainer";
import SectionHeader from "../ui/section/SectionHeader";
import type { Establishment } from "@/types/establishment/etablihment.interface";

export default function TendenciesSection() {
  const { useGetEstablishments } = useEstablishmentApi();
  const { data: establishments } = useGetEstablishments("?limit=3&page=1");
  return (
    <SectionContainer className="flex flex-col items-center justify-center gap-8">
      <SectionHeader
        className=""
        title="Tendencias"
        description=" "
        descriptionClassName="bg-fourth h-[2px] w-20 rounded-full"
      />
      <SectionBody className="grid w-full grid-cols-3 gap-4 text-xs md:grid-cols-4 lg:grid-cols-5">
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
    <div>
      <h2>{establishment.name}</h2>
      <p>{establishment.description}</p>
    </div>
  );
}
