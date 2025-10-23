import { queryClient } from "@/context/query-client-instance";
import { reviewService } from "../review-service";

export const prefetchEstablishmentReviewsQuery = async (establishmentId: string) => {
    await queryClient.prefetchQuery({
        queryKey: ["reviews", establishmentId],
        queryFn: () => reviewService.getReviewsByEstablishmentId(establishmentId).then((res) => res.data.data),
    });
}