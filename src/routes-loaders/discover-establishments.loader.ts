import { prefetchCategoriesQuery } from "@/api/prefetch-queries/prefetch-categories-query";
import { prefetchEstablishmentsQuery } from "@/api/prefetch-queries/prefetch-establishments-query";

export const discoverEstablishmentsLoader = async ({ request }: { request: Request }) => {
    await Promise.all([
        prefetchEstablishmentsQuery(request),
        prefetchCategoriesQuery(),
    ]);
}