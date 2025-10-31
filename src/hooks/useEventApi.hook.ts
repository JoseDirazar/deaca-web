import { eventService } from "@/api/event-service";
import type { EventDto } from "@/types/common/api-request.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useEventApi = () => {
  const queryClient = useQueryClient();
  const useGetEvents = () => {
    const { data, isLoading, error } = useQuery({
      queryKey: ["events"],
      queryFn: () => eventService.findAll(),
    });
    return { data, isLoading, error };
  };
  const useGetEventById = (id: string) => {
    const { data, isLoading, error } = useQuery({
      queryKey: ["event", id],
      queryFn: () => eventService.getEventById(id),
    });
    return { data, isLoading, error };
  };
  const useCreateEvent = useMutation({
    mutationFn: (event: EventDto) =>
      eventService.createEvent(event).then((res) => res?.data),
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success(message || "Evento creado");
    },
    onError: (error) => {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
      else toast.error("Error al crear el evento");
    },
  });
  const useUpdateEvent = useMutation({
    mutationFn: ({ id, event }: { id: string; event: EventDto }) =>
      eventService.updateEvent(id, event).then((res) => res?.data),
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success(message || "Evento actualizado");
    },
    onError: (error) => {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
      else toast.error("Error al actualizar el evento");
    },
  });
  const useDeleteEvent = useMutation({
    mutationFn: (id: string) =>
      eventService.deleteEvent(id).then((res) => res?.data),
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success(message || "Evento eliminado");
    },
    onError: (error) => {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
      else toast.error("Error al eliminar el evento");
    },
  });
  const useUploadEventImage = useMutation({
    mutationFn: ({ id, file }: { id: string; file: FormData }) =>
      eventService.uploadImage(id, file).then((res) => res?.data),
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success(message || "Imagen subida");
    },
    onError: (error) => {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
      else toast.error("Error al subir la imagen");
    },
  });
  const useUploadEventImages = useMutation({
    mutationFn: ({ id, files }: { id: string; files: FormData }) =>
      eventService.uploadImages(id, files).then((res) => res?.data),
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success(message || "Imagenes subidas");
    },
    onError: (error) => {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
      else toast.error("Error al subir las imágenes");
    },
  });

  return {
    useGetEvents,
    useGetEventById,
    useCreateEvent,
    useUpdateEvent,
    useDeleteEvent,
    useUploadEventImage,
    useUploadEventImages,
  };
};
