import type {
  CreateSponsorResponse,
  DeleteSponsorResponse,
  GetSponsorByIdResponse,
  GetSponsorsResponse,
  UpdateSponsorResponse,
  UploadSponsorImageResponse,
} from "@/types/common/api-response.interface";
import api from "./axios-instance";
export interface Sponsor {
  id: number;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}
export const sponsorService = {
  getSponsors: (): GetSponsorsResponse => api.get("/sponsor"),
  getSponsorById: (id?: number): GetSponsorByIdResponse =>
    api.get(`/sponsor/${id}`),
  createSponsor: (sponsor: { name: string }): CreateSponsorResponse =>
    api.post("/sponsor", sponsor),
  updateSponsor: (id: number, name: string): UpdateSponsorResponse =>
    api.put(`/sponsor/${id}`, name),
  deleteSponsor: (id: number): DeleteSponsorResponse =>
    api.delete(`/sponsor/${id}`),
  uploadSponsorImage: (
    id: number,
    formData: FormData,
  ): UploadSponsorImageResponse =>
    api.postForm(`/sponsor/${id}/image`, formData),
};
