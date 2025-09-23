import api from "./axios-instance";

export const userService = {
    getUser: (config?: {
        headers: {
            Authorization: string;
        };
    }): Promise<{ data: { ok: boolean; user: IUser } }> =>
        api.get("/user", config),
    updateUser: (
        data: Partial<IUser>,
    ): Promise<{ data: { ok: boolean; user: IUser } }> => api.put("/user", data),
    updateAvatar: (
        formData: FormData,
    ): Promise<{ data: { ok: boolean; user: IUser } }> => {
        return api.putForm("/user/avatar", formData);
    },
};