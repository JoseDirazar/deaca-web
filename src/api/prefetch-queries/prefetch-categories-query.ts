import { queryClient } from "@/context/query-client-instance";
import { categoryService } from "../category-service";

export const prefetchCategoriesQuery = async (exclude?: string[]) => {
    await queryClient.prefetchQuery({
        queryKey: ["categories", { exclude }],
        queryFn: () =>
            categoryService.getCategories({ exclude }).then((res) => res?.data?.data),
    });
}