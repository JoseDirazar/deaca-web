import Swiper from "@/context/swiper";
import type { AppReview } from "@/types/reviews/app-review.interface";
import { SwiperSlide } from "swiper/react";
import SectionHeader from "../ui/section/SectionHeader";
import TestimonyCard from "../review/TestimonyCard";

export default function UsersTestimoniesSection({
  appReviews,
}: {
  appReviews?: AppReview[];
}) {
  if (appReviews?.length === 0)
    return (
      <div className="text-center text-xl font-bold text-gray-300 md:text-2xl">
        No hay revisiones sobre{" "}
        <span className="font-nueva text-2xl md:text-3xl">deacá</span>
      </div>
    );

  return (
    <div className="flex w-full flex-col gap-8 bg-primary">
      <SectionHeader
        className="mt-8 text-white"
        title="La opinión de nuestros usuarios"
        separator
        separatorClassName="bg-white"
      />
      <Swiper>
        {appReviews?.map((appReview) => (
          <SwiperSlide key={appReview.id} className="">
            <TestimonyCard appReview={appReview} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
