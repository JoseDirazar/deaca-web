import { queryClient } from "@/context/query-client-instance";
import { establishmentService } from "../establishment-service";

export const prefetchEstablishmentQuery = async (id: string) => {
    await queryClient.prefetchQuery({
        queryKey: ["establishment", id],
        queryFn: () =>
            establishmentService
                .getById(id)
                .then((res) => res?.data?.data),

    });
}