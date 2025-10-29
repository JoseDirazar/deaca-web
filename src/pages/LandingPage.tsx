import CategorySection from "@/component/landing/CategorySection";
import ReachOutSection from "@/component/landing/ReachOutSection";
import RegisterSection from "@/component/landing/RegisterSection";
import SearchSection from "@/component/landing/welcome-section/SearchSection";
import SponsorsSection from "@/component/landing/SponsorsSection";
import TendenciesSection from "@/component/landing/TendenciesSection";
import UsersTestimoniesSection from "@/component/landing/UsersTestimoniesSection";
import PageContainer from "@/component/ui/PageContainer";

import { useCategoryApi } from "@/hooks/useCategoryApi.hook";
import { useAppReviewsApi } from "@/hooks/useAppReviewsApi.hook";
import GoogleOneTapButton from "@/component/ui/GoogleOneTapButton";

export default function LandingPage() {
  const { useGetCategories } = useCategoryApi();
  const { data: categories } = useGetCategories({
    exclude: ["24Hs", "Domingos", "Vida Nocturna"],
  });
  const { useGetAppReviews } = useAppReviewsApi();
  const { data: appReviews } = useGetAppReviews;

  return (
    <PageContainer className="gap-12">
      <SearchSection categories={categories?.data || []} />
      <CategorySection categories={categories?.data || []} />
      <TendenciesSection />
      <RegisterSection />
      <SponsorsSection />
      <UsersTestimoniesSection appReviews={appReviews?.data || []} />
      <ReachOutSection />
      <GoogleOneTapButton />
    </PageContainer>
  );
}
