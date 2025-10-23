import { prefetchAppReviewsQuery } from "@/api/prefetch-queries/prefetch-app-reviews-query";
import { prefetchCategoriesQuery } from "@/api/prefetch-queries/prefetch-categories-query";

export const landingPageLoader = async () => {
    await Promise.all([
        prefetchCategoriesQuery(),
        prefetchAppReviewsQuery(),
    ]);
}
