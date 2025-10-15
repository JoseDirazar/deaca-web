import api from "./axios-instance";
import type { CreateEstablishmentResponse, DeleteEstablishmentImageResponse, DeleteMyEstablishmentResponse, GetEstablishmentByIdResponse, GetEstablishmentsResponse, GetMyEstablishmentsResponse, UpdateMyEstablishmentResponse, UploadEstablishmentAvatarResponse, UploadEstablishmentImagesResponse, VerifyEstablishmentResponse } from "@/types/common/api-response.interface";
import type { CreateEstablishmentDto, EditEstablishmentDto } from "@/types/common/api-request.interface";

export const establishmentService = {
  getEstablishments: (query: string): GetEstablishmentsResponse => api.get("/establishment" + query),
  getById: (id: string): GetEstablishmentByIdResponse => api.get(`/establishment/${id}`),
  getMine: (): GetMyEstablishmentsResponse => api.get("/establishment/mine"),
  createMine: (payload: CreateEstablishmentDto): CreateEstablishmentResponse => api.post("/establishment/mine", payload),
  updateMine: (id: string, payload: EditEstablishmentDto): UpdateMyEstablishmentResponse => api.put(`/establishment/${id}`, payload),
  deleteMine: (id: string): DeleteMyEstablishmentResponse => api.delete(`/establishment/${id}`),
  uploadImages: (id: string, formData: FormData): UploadEstablishmentImagesResponse => api.postForm(`/establishment/${id}/images`, formData),
  uploadAvatar: (id: string, formData: FormData): UploadEstablishmentAvatarResponse => api.postForm(`/establishment/${id}/avatar`, formData),
  verify: (id: string, verified: boolean): VerifyEstablishmentResponse => api.patch(`/establishment/${id}/verify`, { verified }),
  deleteImage: (id: string, imageId: string): DeleteEstablishmentImageResponse => api.delete(`/establishment/${id}/image/${imageId}`),
};
