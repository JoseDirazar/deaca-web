import { sponsorService } from "@/api/sponsor-service";
import Swiper from "@/context/swiper";
import { generateImageUrl } from "@/lib/generate-image-url";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SwiperSlide } from "swiper/react";

export default function SponsorsSection() {
  const { data } = useSuspenseQuery({
    queryKey: ["sponsors"],
    queryFn: () => sponsorService.getSponsors().then((res) => res?.data),
  });
  return (
    <Swiper>
      {data?.data?.map((sponsor) => (
        <SwiperSlide key={sponsor.id}>
          <img
            src={generateImageUrl("sponsor", sponsor.image)}
            alt={sponsor.name}
            className="h-full w-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
