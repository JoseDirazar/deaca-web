import CategorySection from "@/component/landing/CategorySection";
import ReachOutSection from "@/component/landing/ReachOutSection";
import RegisterSection from "@/component/landing/RegisterSection";
import SearchSection from "@/component/landing/SearchSection";
import SponsorsSection from "@/component/landing/SponsorsSection";
import TendenciesSection from "@/component/landing/TendenciesSection";
import UsersTestimoniesSection from "@/component/landing/UsersTestimoniesSection";
import PageContainer from "@/component/ui/PageContainer";
import { useCategoryApi } from "@/hooks/useCategoryApi.hook";
import { useNavigate } from "react-router";

export default function LandingPage() {
  const { getCategories } = useCategoryApi();
  const {
    data: categories,
    isPending: categoriesPending,
    isError: isCategoriesError,
    error: categoriesError,
  } = getCategories;
  const navigate = useNavigate();

  return (
    <PageContainer>
      <SearchSection categories={categories || []} />
      <CategorySection categories={categories || []} />
      <TendenciesSection />
      <RegisterSection />
      <SponsorsSection />
      <UsersTestimoniesSection />
      <ReachOutSection />
    </PageContainer>
  );
}
