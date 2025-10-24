import CategorySection from "@/component/landing/CategorySection";
import ReachOutSection from "@/component/landing/ReachOutSection";
import RegisterSection from "@/component/landing/RegisterSection";
import SearchSection from "@/component/landing/welcome-section/SearchSection";
import SponsorsSection from "@/component/landing/SponsorsSection";
import TendenciesSection from "@/component/landing/TendenciesSection";
import UsersTestimoniesSection from "@/component/landing/UsersTestimoniesSection";
import PageContainer from "@/component/ui/PageContainer";

import { useSuspenseQuery } from "@tanstack/react-query";
import { categoryService } from "@/api/category-service";
import { appReviewService } from "@/api/app-review-service";
import AppReviewForm from "@/component/review/AppReviewForm";
import Modal from "@/component/ui/Modal";
import Button from "@/component/ui/Button";
import { useState } from "react";
import { SwiperSlide } from "swiper/react";
import Swiper from "@/context/swiper";

export default function LandingPage() {
  const { data: categories } = useSuspenseQuery({
    queryKey: ["categories"],
    queryFn: () =>
      categoryService.getCategories().then((res) => res.data.data || []),
  });

  const { data: appReviews } = useSuspenseQuery({
    queryKey: ["app-reviews"],
    queryFn: () =>
      appReviewService.findAll().then((res) => res.data.data || []),
  });
  const [isOpen, setIsOpen] = useState(false);
  console.log(appReviews);
  return (
    <PageContainer className="gap-12">
      <SearchSection categories={categories || []} />
      <CategorySection categories={categories || []} />
      <TendenciesSection />
      <RegisterSection />
      <SponsorsSection />
      <UsersTestimoniesSection appReviews={appReviews || []} />
      <ReachOutSection />
      <Modal setIsOpen={setIsOpen} isOpen={isOpen}>
        <AppReviewForm />
      </Modal>
      <Swiper>
        <SwiperSlide>
          <div className="h-44 w-44 bg-primary"></div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="h-44 w-44 bg-primary"></div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="h-44 w-44 bg-primary"></div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="h-44 w-44 bg-primary"></div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="h-44 w-44 bg-primary"></div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="h-44 w-44 bg-primary"></div>
        </SwiperSlide>
      </Swiper>
      <Button label="Agregar testimonio" onClick={() => setIsOpen(true)} />
    </PageContainer>
  );
}
