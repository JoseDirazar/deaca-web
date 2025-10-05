import { userService } from "@/api/user-service";
import { useUserStore } from "@/context/useUserStore";
import type { EditProfileDto } from "@/types/common/api-request.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUserApi = () => {
    const queryClient = useQueryClient();
    const { setUser } = useUserStore();

    const getUser = useQuery({
        queryKey: ["user", "me"],
        queryFn: () => userService.getUser().then(res => res?.data?.data || null),
    });

    const useGetUsers = (queryParams: string, page: number, limit: number, sortBy: string, sortOrder: string) => {
        return useQuery({
            queryKey: ["users", page, limit, sortBy, sortOrder],
            queryFn: () => userService.getUsers(queryParams).then(res => res?.data || null),
        });
    }

    const updateUser = useMutation({
        mutationFn: (data: EditProfileDto) => userService.updateUser(data).then(res => res?.data?.data),
        onSuccess: (response) => {
            setUser(response)
            toast.success("Avatar updated successfully");
            queryClient.invalidateQueries({ queryKey: ["user", "me"] });
        },
        onError: (error) => {
            toast.error("Error updating avatar");
            console.error(error)
        },
    });

    const updateAvatar = useMutation({
        mutationFn: (formData: FormData) => userService.updateAvatar(formData).then(res => res?.data?.data),
        onSuccess: (response) => {
            setUser(response)
            toast.success("Avatar updated successfully");
            queryClient.invalidateQueries({ queryKey: ["user", "me"] });
        },
        onError: (error) => {
            toast.error("Error updating avatar");
            console.error(error)
        },
    });

    return {
        getUser,
        useGetUsers,
        updateUser,
        updateAvatar,
    }
}