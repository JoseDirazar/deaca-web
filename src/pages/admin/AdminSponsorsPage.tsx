import { Suspense } from "react";
import Loader from "@/component/ui/Loader";
import { useSuspenseQuery } from "@tanstack/react-query";
import { sponsorService } from "@/api/sponsor-service";
import PageHeader from "@/component/PageHeader";

import DLink from "@/component/ui/DLink";
import { generateImageUrl } from "@/lib/generate-image-url";

export default function AdminSponsorsPage() {
  const { data } = useSuspenseQuery({
    queryKey: ["sponsors"],
    queryFn: () => sponsorService.getSponsors().then((res) => res?.data),
  });
  console.log(data);
  return (
    <Suspense fallback={<Loader />}>
      <PageHeader
        title="Patrocinadores"
        description="Gestionar patrocinadores"
        subdescription="Gestiona los patrocinadores que aparecen en la Home"
      />
      <DLink to="/admin/patrocinadores/nuevo" label="Nuevo patrocinador" />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {data?.data?.map((sponsor) => (
            <div key={sponsor.id} className="flex gap-2">
              <img src={generateImageUrl("sponsor", sponsor.image)} alt="" />
              <p>{sponsor.name}</p>
            </div>
          ))}
        </div>
      </div>
    </Suspense>
  );
}
