import api from "./axios-instance";
import type { ApiResponse } from "@/types/common/api-response.interface";
import type { Establishment } from "@/types/establishment/etablihment.interface";

export interface Tendency {
  id: string;
  position: number;
  establishmentId: string;
  establishment: Establishment;
}

export const tendencyService = {
  list: (): Promise<{ data: Tendency[] }> => api.get("/tendency").then((r) => r.data),
  createOrUpdate: (payload: { establishmentId: string; position: number }): Promise<ApiResponse<Tendency>> =>
    api.post("/tendency", payload).then((r) => r.data),
  reorder: (items: { id: string; position: number }[]): Promise<ApiResponse<Tendency[]>> =>
    api.put("/tendency/reorder", { items }).then((r) => r.data),
  remove: (id: string): Promise<ApiResponse<{ id: string }>> => api.delete(`/tendency/${id}`).then((r) => r.data),
};


