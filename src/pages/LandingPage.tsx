import CategorySection from "@/component/landing/CategorySection";
import ReachOutSection from "@/component/landing/ReachOutSection";
import RegisterSection from "@/component/landing/RegisterSection";
import SearchSection from "@/component/landing/welcome-section/SearchSection";
import SponsorsSection from "@/component/landing/SponsorsSection";
import TendenciesSection from "@/component/landing/TendenciesSection";
import UsersTestimoniesSection from "@/component/landing/UsersTestimoniesSection";
import PageContainer from "@/component/ui/PageContainer";
import { useCategoryApi } from "@/hooks/useCategoryApi.hook";
import { Suspense } from "react";
import Loader from "@/component/ui/Loader";
import { toast } from "sonner";

export default function LandingPage() {
  const { getCategories } = useCategoryApi();
  const { data: categories, isPending: categoriesPending } = getCategories;

  if (categoriesPending) return <Loader />;

  return (
    <PageContainer className="gap-12">
      <Suspense fallback={<Loader />}>
        <SearchSection categories={categories || []} />
        <CategorySection categories={categories || []} />
        <TendenciesSection />
        <RegisterSection />
        <SponsorsSection />
        <UsersTestimoniesSection />
        <ReachOutSection />
        <button
          onClick={() =>
            toast.warning("Loading...", {
              duration: 5000,
            })
          }
        >
          Show toast
        </button>
      </Suspense>
    </PageContainer>
  );
}
