import { Suspense } from "react";
import Loader from "@/component/ui/Loader";
import PageHeader from "@/component/PageHeader";

import DLink from "@/component/ui/DLink";
import { generateImageUrl } from "@/lib/generate-image-url";
import { useSponsorsApi } from "@/hooks/useSponsorsApi";

export default function AdminSponsorsPage() {
  const { data } = useSponsorsApi().useGetSponsors();
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
              <img
                src={generateImageUrl("sponsor", sponsor.image)}
                alt={sponsor.name}
                className="w-44 object-cover"
              />
              <p>{sponsor.name}</p>
            </div>
          ))}
        </div>
      </div>
    </Suspense>
  );
}
