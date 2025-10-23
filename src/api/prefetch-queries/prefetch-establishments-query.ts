import { queryClient } from "@/context/query-client-instance";
import { establishmentService } from "../establishment-service";

export const prefetchEstablishmentsQuery = async (request: Request) => {
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    await queryClient.prefetchQuery({
        queryKey: ["establishments", searchParams],
        queryFn: () =>
            establishmentService
                .getEstablishments(`?${searchParams}`)
                .then((res) => res?.data || null),
    });
}
