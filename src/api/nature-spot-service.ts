import type { NatureSpot } from "@/types/nature-spot/nature-spot.interface";
import api from "./axios-instance";
import type {
  CreateNatureSpotResponse,
  DeleteNatureSpotResponse,
  GetNatureSpotByIdResponse,
  GetNatureSpotsResponse,
  UpdateNatureSpotResponse,
  UploadNatureSpotImagesResponse,
} from "@/types/common/api-response.interface";

export const natureSpotService = {
  findAll: (): GetNatureSpotsResponse => api.get("/nature-spot"),
  findOne: (id: string): GetNatureSpotByIdResponse =>
    api.get(`/nature-spot/${id}`),
  create: (natureSpot: NatureSpot): CreateNatureSpotResponse =>
    api.post("/nature-spot", natureSpot),
  update: (id: string, natureSpot: NatureSpot): UpdateNatureSpotResponse =>
    api.put(`/nature-spot/${id}`, natureSpot),
  delete: (id: string): DeleteNatureSpotResponse =>
    api.delete(`/nature-spot/${id}`),
  uploadImages: (
    id: string,
    formData: FormData,
  ): UploadNatureSpotImagesResponse =>
    api.postForm(`/nature-spot/${id}/images`, formData),
  uploadImage: (
    id: string,
    formData: FormData,
  ): UploadNatureSpotImagesResponse =>
    api.postForm(`/nature-spot/${id}/image`, formData),
};
