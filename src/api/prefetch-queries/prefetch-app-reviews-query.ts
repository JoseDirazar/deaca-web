import { queryClient } from "@/context/query-client-instance";
import { appReviewService } from "../app-review-service";

export const prefetchAppReviewsQuery = async () => {
    await queryClient.prefetchQuery({
        queryKey: ["app-reviews"],
        queryFn: () => appReviewService.findAll().then(res => res?.data?.data),
    });
}