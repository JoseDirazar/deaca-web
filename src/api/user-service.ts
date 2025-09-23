import type { User } from "@/types/user/user.interface";
import api from "./axios-instance";

export const userService = {
  getUser: (config?: {
    headers: {
      Authorization: string;
    };
  }): Promise<{ data: { ok: boolean; user: User } }> =>
    api.get("/user", config),
  updateUser: (
    data: Partial<User>
  ): Promise<{ data: { ok: boolean; user: User } }> => api.put("/user", data),
  updateAvatar: (
    formData: FormData
  ): Promise<{ data: { ok: boolean; user: User } }> => {
    return api.putForm("/user/avatar", formData);
  },
};
