import api from "./axios-instance";

export const pharmacyService = {
  getAll: () => api.get("/farmacias"),
};
