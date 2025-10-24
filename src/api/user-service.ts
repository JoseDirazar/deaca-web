import api from "./axios-instance";
import type { EditProfileResponse, GetMyProfileResponse, GetUsersResponse, PromoteUserToAdminResponse, UploadAvatarResponse } from "@/types/common/api-response.interface";
import type { AccountStatus, EditProfileDto } from "@/types/common/api-request.interface";

export const userService = {
    getUser: (): GetMyProfileResponse => api.get("/user/me"),
    updateUser: (data: EditProfileDto): EditProfileResponse => api.put("/user", data),
    updateAvatar: (formData: FormData): UploadAvatarResponse => api.putForm("/user/avatar", formData),
    getUsers: (query: string): GetUsersResponse => api.get("/user" + query),
    changeUserAccountStatus: (data: { email: string; status: AccountStatus }): EditProfileResponse => api.put("/user/status", data),
    sendContactEmail: (data: { name: string; email: string; message: string }): EditProfileResponse => api.post("/user/contact", data),
    promoteUserToAdmin: (data: { email: string }): PromoteUserToAdminResponse => api.put("/user/admin", data),
};
