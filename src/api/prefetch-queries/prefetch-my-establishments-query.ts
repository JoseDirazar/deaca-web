import { queryClient } from "@/context/query-client-instance";
import { establishmentService } from "../establishment-service";

export const prefetchMyEstablishmentsQuery = async () => {
    await queryClient.prefetchQuery({
        queryKey: ["establishments", "me"],
        queryFn: () => establishmentService.getMine().then(res => res.data.data),
    });
}