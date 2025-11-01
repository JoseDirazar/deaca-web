import type {
  CreateEventResponse,
  DeleteEventResponse,
  GetEventByIdResponse,
  GetEventsResponse,
  UpdateEventResponse,
  UploadEventImagesResponse,
} from "@/types/common/api-response.interface";
import api from "./axios-instance";
import type { EventDto } from "@/types/common/api-request.interface";

export const eventService = {
  findAll: (): GetEventsResponse => api.get(`/event`),
  getEventById: (id: string): GetEventByIdResponse => api.get(`/event/${id}`),
  createEvent: (data: EventDto): CreateEventResponse =>
    api.post(`/event`, data),
  updateEvent: (id: string, data: EventDto): UpdateEventResponse =>
    api.put(`/event/${id}`, data),
  deleteEvent: (id: string): DeleteEventResponse => api.delete(`/event/${id}`),
  uploadImages: (id: string, formData: FormData): UploadEventImagesResponse =>
    api.postForm(`/event/${id}/images`, formData),
  uploadImage: (id: string, formData: FormData): UploadEventImagesResponse =>
    api.postForm(`/event/${id}/image`, formData),
  deleteImage: (id: string, imageId: string) =>
    api.delete(`/event/${id}/image/${imageId}`),
};
