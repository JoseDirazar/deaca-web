import { establishmentService } from "@/api/establishment-service";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import type {
  CreateEstablishmentDto,
  EditEstablishmentDto,
} from "@/types/common/api-request.interface";
import { toast } from "sonner";
import { AxiosError } from "axios";
import type { EstablishmentStatus } from "@/types/enums/establishment-status.enum";

export const useEstablishmentApi = () => {
  const useGetEstablishmentBySlug = (slug?: string) => {
    return useQuery({
      queryKey: ["establishments", slug],
      queryFn: () =>
        establishmentService.getBySlug(slug).then((res) => res?.data?.data),
      enabled: Boolean(slug),
    });
  };

  const useGetEstablishments = (queryParams: string) => {
    return useQuery({
      queryKey: ["establishments", queryParams],
      queryFn: () =>
        establishmentService
          .getEstablishments(queryParams)
          .then((res) => res?.data),
    });
  };

  const useGetAdminEstablishmentsChart = () => {
    return useSuspenseQuery({
      queryKey: ["admin-establishments-chart"],
      queryFn: () =>
        establishmentService
          .getAdminEstablishmentsChart()
          .then((res) => res?.data),
    });
  };

  const useGetMyEstablishments = () => {
    return useSuspenseQuery({
      queryKey: ["establishments", "me"],
      queryFn: () => establishmentService.getMine().then((res) => res?.data),
    });
  };

  const createEstablishment = useMutation({
    mutationFn: (data: CreateEstablishmentDto) =>
      establishmentService.createMine(data).then((res) => res?.data),
    onSuccess: () => {
      toast.success("Emprendimiento creado");
    },
    onError: (error) => {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
      else toast.error("Error al crear el emprendimiento");
    },
  });

  const updateEstablishment = useMutation({
    mutationFn: (data: EditEstablishmentDto) =>
      establishmentService.updateMine(data.id, data).then((res) => res?.data),
    onSuccess: () => {
      toast.success("Emprendimiento actualizado");
    },
    onError: (error) => {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
      else toast.error("Error al actualizar el emprendimiento");
    },
  });

  const updateEstablishmentAvatar = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      establishmentService.uploadAvatar(id, formData).then((res) => res?.data),
    onSuccess: () => {},
    onError: (error) => {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
      else toast.error("Error al subir la imagen");
    },
  });

  const updateEstablishmentImages = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      establishmentService.uploadImages(id, formData).then((res) => res?.data),
    onSuccess: () => {},
    onError: (error) => {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
      else toast.error("Error al subir las imágenes");
    },
  });

  const deleteEstablishment = useMutation({
    mutationFn: (id: string) =>
      establishmentService.deleteMine(id).then((res) => res?.data),
    onSuccess: () => {
      toast.success("Emprendimiento eliminado correctamente");
    },
    onError: (error) => {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
      else toast.error("Error al eliminar el emprendimiento");
    },
  });

  const deleteEstablishmentImage = useMutation({
    mutationFn: ({ id, imageId }: { id: string; imageId: string }) =>
      establishmentService.deleteImage(id, imageId).then((res) => res?.data),
    onSuccess: () => {
      toast.success("Imagen eliminada");
    },
    onError: (error) => {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
      else toast.error("Error al eliminar la imagen");
    },
  });

  const changeEstablishmentStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: EstablishmentStatus }) =>
      establishmentService.changeStatus(id, status).then((res) => res?.data),
    onSuccess: ({ message }) => {
      toast.success(message || "Estado actualizado");
    },
    onError: (error) => {
      console.error(error);
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message);
        toast.error("Error al actualizar el emprendimiento");
      } else toast.error("Error al actualizar el emprendimiento");
    },
  });

  return {
    useGetEstablishmentBySlug,
    useGetEstablishments,
    useGetMyEstablishments,
    useGetAdminEstablishmentsChart,
    updateEstablishment,
    updateEstablishmentAvatar,
    updateEstablishmentImages,
    createEstablishment,
    deleteEstablishment,
    deleteEstablishmentImage,
    changeEstablishmentStatus,
  };
};
