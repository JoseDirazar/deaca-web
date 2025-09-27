import { useQuery } from "@tanstack/react-query";
import { userService } from "../api/user-service";

export const useGetPaginatedUsers = (query: string) => {

    const { data, isPending, error, isError } = useQuery({
        queryKey: ["users", query],
        queryFn: () => userService.getUsers(query),
    });

    return {
        users: data?.data.data ?? [],
        meta: data?.data.meta,
        isLoading: isPending,
        error,
        isError,
    };
}
