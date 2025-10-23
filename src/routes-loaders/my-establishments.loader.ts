import { prefetchMyEstablishmentsQuery } from "@/api/prefetch-queries/prefetch-my-establishments-query";

export const myEstablishmentsLoader = async () => {
    await prefetchMyEstablishmentsQuery();
}
