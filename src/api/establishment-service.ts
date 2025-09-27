import type { Establishment } from "@/types/establishment/etablihment.interface";
import api from "./axios-instance";
import type { ApiPaginatedResponse } from "@/types/common/api-response.interface";

export const establishmentService = {
  getEstablishments: (
    query: string,
  ): Promise<ApiPaginatedResponse<Establishment[]>> => api.get("/establishment" + query),
};
