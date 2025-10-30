import type { GetVisitsByEstablishmentOwnerIdResponse } from "@/types/common/api-response.interface";
import api from "./axios-instance";

export const analyticsService = {
  getTotalVisitsForEstablishmentOwner:
    (): GetVisitsByEstablishmentOwnerIdResponse =>
      api.get("/analytics/establishment-owner"),
};
