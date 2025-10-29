import { appReviewService } from "@/api/app-review-service";
import { useQuery } from "@tanstack/react-query";

export const useAppReviewsApi = () => {
  const useGetAppReviews = useQuery({
    queryKey: ["app-reviews"],
    queryFn: () => appReviewService.findAll().then((res) => res.data),
  });

  return {
    useGetAppReviews,
  };
};
