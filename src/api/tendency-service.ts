import api from "./axios-instance";
import type {
  CreateOrUpdateTendencyResponse,
  GetTendenciesResponse,
  RemoveTendencyResponse,
  ReorderTendenciesResponse,
} from "@/types/common/api-response.interface";
import type { Establishment } from "@/types/establishment/etablihment.interface";

export interface Tendency {
  id: string;
  position: number;
  establishmentId: string;
  establishment: Establishment;
}

export const tendencyService = {
  list: (): GetTendenciesResponse => api.get("/tendency"),
  createOrUpdate: (payload: {
    establishmentId: string;
    position: number;
  }): CreateOrUpdateTendencyResponse => api.post("/tendency", payload),
  reorder: (
    items: { id: string; position: number }[],
  ): ReorderTendenciesResponse => api.put("/tendency/reorder", { items }),
  remove: (id: string): RemoveTendencyResponse => api.delete(`/tendency/${id}`),
};
