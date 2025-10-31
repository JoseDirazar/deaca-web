import type {
  GetAdminAnalyticsChartResponse,
  GetVisitsByEstablishmentOwnerIdResponse,
} from "@/types/common/api-response.interface";
import api from "./axios-instance";

export const analyticsService = {
  getTotalVisitsForEstablishmentOwner:
    (): GetVisitsByEstablishmentOwnerIdResponse =>
      api.get("/analytics/establishment-owner"),
  registerVisit: () => api.post("/analytics/register-visit"),
  getAdminAnalyticsChart: (): GetAdminAnalyticsChartResponse =>
    api.get("/analytics/admin-analytics-chart"),
};
