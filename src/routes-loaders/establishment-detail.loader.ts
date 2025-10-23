import { prefetchEstablishmentQuery } from "@/api/prefetch-queries/prefetch-establishment-query";
import { prefetchEstablishmentReviewsQuery } from "@/api/prefetch-queries/prefetch-establishment-reviews-query";

export const establishmentDetailLoader = async ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    if (!id) return;
    await Promise.all([
        prefetchEstablishmentQuery(id),
        prefetchEstablishmentReviewsQuery(id),
    ]);
}
