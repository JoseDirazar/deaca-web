import { natureSpotService } from "@/api/nature-spot-service";
import type { NatureSpot } from "@/types/nature-spot/nature-spot.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useNatureSpotApi = () => {
  const queryClient = useQueryClient();
  const useGetNatureSpots = () => {
    const { data, isLoading, error } = useQuery({
      queryKey: ["nature-spots"],
      queryFn: () => natureSpotService.findAll().then((res) => res?.data),
    });
    return { data, isLoading, error };
  };
  const useGetNatureSpotById = (id: string) => {
    const { data, isLoading, error } = useQuery({
      queryKey: ["nature-spot", id],
      queryFn: () => natureSpotService.findOne(id).then((res) => res?.data),
    });
    return { data, isLoading, error };
  };
  const useCreateNatureSpot = useMutation({
    mutationFn: (natureSpot: NatureSpot) =>
      natureSpotService.create(natureSpot).then((res) => res?.data),
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["nature-spots"] });
      toast.success(message || "Paseo creado");
    },
    onError: (error) => {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
      else toast.error("Error al crear el paseo");
    },
  });
  const useUpdateNatureSpot = useMutation({
    mutationFn: ({ id, natureSpot }: { id: string; natureSpot: NatureSpot }) =>
      natureSpotService.update(id, natureSpot).then((res) => res?.data),
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["nature-spots"] });
      toast.success(message || "Paseo actualizado");
    },
    onError: (error) => {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
      else toast.error("Error al actualizar el paseo");
    },
  });
  const useDeleteNatureSpot = useMutation({
    mutationFn: (id: string) =>
      natureSpotService.delete(id).then((res) => res?.data),
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["nature-spots"] });
      toast.success(message || "Paseo eliminado");
    },
    onError: (error) => {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
      else toast.error("Error al eliminar el evento");
    },
  });
  const useUploadNatureSpotImage = useMutation({
    mutationFn: ({ id, file }: { id: string; file: FormData }) =>
      natureSpotService.uploadImage(id, file).then((res) => res?.data),
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["nature-spots"] });
      toast.success(message || "Imagen subida");
    },
    onError: (error) => {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
      else toast.error("Error al subir la imagen");
    },
  });
  const useUploadNatureSpotImages = useMutation({
    mutationFn: ({ id, files }: { id: string; files: FormData }) =>
      natureSpotService.uploadImages(id, files).then((res) => res?.data),
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["nature-spots"] });
      toast.success(message || "Imagenes subidas");
    },
    onError: (error) => {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
      else toast.error("Error al subir las imágenes");
    },
  });

  const useDeleteNatureSpotImage = useMutation({
    mutationFn: ({ id, imageId }: { id: string; imageId: string }) =>
      natureSpotService.deleteImage(id, imageId).then((res) => res?.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nature-spots"] });
      queryClient.refetchQueries({ queryKey: ["nature-spot"] });
      toast.success("Imagen eliminada");
    },
    onError: (error) => {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
      else toast.error("Error al eliminar la imagen");
    },
  });

  return {
    useGetNatureSpots,
    useGetNatureSpotById,
    useCreateNatureSpot,
    useUpdateNatureSpot,
    useDeleteNatureSpot,
    useUploadNatureSpotImage,
    useUploadNatureSpotImages,
    useDeleteNatureSpotImage,
  };
};
