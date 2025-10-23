import { queryClient } from "@/context/query-client-instance";
import { categoryService } from "../category-service";

export const prefetchCategoriesQuery = async () => {
    await queryClient.prefetchQuery({
        queryKey: ["categories"],
        queryFn: () =>
            categoryService.getCategories().then((res) => res?.data?.data),
    });
}