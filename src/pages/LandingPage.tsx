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

export default function LandingPage() {
  const { data: categories } = useSuspenseQuery({
    queryKey: ["categories", ["24Hs", "Domingos", "Vida Nocturna"]],
    queryFn: () =>
      categoryService
        .getCategories({ exclude: ["24Hs", "Domingos", "Vida Nocturna"] })
        .then((res) => res.data.data || []),
  });

  const { data: appReviews } = useSuspenseQuery({
    queryKey: ["app-reviews"],
    queryFn: () =>
      appReviewService.findAll().then((res) => res.data.data || []),
  });

  return (
    <PageContainer className="gap-12">
      <SearchSection categories={categories || []} />
      <CategorySection categories={categories || []} />
      <TendenciesSection />
      <RegisterSection />
      <SponsorsSection />
      <UsersTestimoniesSection appReviews={appReviews || []} />
      <ReachOutSection />
    </PageContainer>
  );
}
