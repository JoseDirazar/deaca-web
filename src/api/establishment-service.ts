import type { Establishment } from "@/types/establishment/etablihment.interface";
import api from "./axios-instance";
import type { ApiPaginatedResponse, ApiResponse } from "@/types/common/api-response.interface";

export const establishmentService = {
  getEstablishments: (
    query: string,
  ): Promise<ApiPaginatedResponse<Establishment[]>> => api.get("/establishment" + query),

  getById: (id: string): Promise<ApiResponse<Establishment>> => api.get(`/establishment/${id}`),

  // Owner scoped
  getMine: (): Promise<ApiResponse<Establishment[]>> => api.get("/establishment/mine"),
  createMine: (payload: Partial<Establishment>): Promise<ApiResponse<Establishment>> =>
    api.post("/establishment/mine", payload),
  updateMine: (id: string, payload: Partial<Establishment>): Promise<ApiResponse<Establishment>> =>
    api.put(`/establishment/${id}`, payload),
  deleteMine: (id: string): Promise<{ data: { ok: boolean } }> => api.delete(`/establishment/${id}`),

  // Uploads
  uploadImage: (id: string, file: File): Promise<{ data: any }> => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`/establishment/${id}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  uploadAvatar: (id: string, file: File): Promise<{ data: any }> => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`/establishment/${id}/avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Admin
  verify: (id: string, verified: boolean): Promise<ApiResponse<Establishment>> =>
    api.patch(`/establishment/${id}/verify`, { verified }),
};
