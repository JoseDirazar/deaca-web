import type { User } from "@/types/user/user.interface";
import api from "./axios-instance";
import type { ApiPaginatedResponse, ApiResponse } from "@/types/common/api-response.interface";

export const userService = {
    getUser: (): Promise<ApiResponse<User>> =>
        api.get("/user/me"),
    updateUser: (
        data: Partial<User>
    ): Promise<ApiResponse<User>> => api.put("/user", data),
    updateAvatar: (
        formData: FormData
    ): Promise<ApiResponse<User>> => {
        return api.putForm("/user/avatar", formData);
    },
    getUsers: (query: string): Promise<ApiPaginatedResponse<User[]>> => api.get("/user" + query),
};
