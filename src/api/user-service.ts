import api from "./axios-instance";
import type { EditProfileResponse, GetMyProfileResponse, GetUsersResponse, UploadAvatarResponse } from "@/types/common/api-response.interface";
import type { EditProfileDto } from "@/types/common/api-request.interface";

export const userService = {
    getUser: (): GetMyProfileResponse => api.get("/user/me"),
    updateUser: (data: EditProfileDto): EditProfileResponse => api.put("/user", data),
    updateAvatar: (formData: FormData): UploadAvatarResponse => api.putForm("/user/avatar", formData),
    getUsers: (query: string): GetUsersResponse => api.get("/user" + query),
};
