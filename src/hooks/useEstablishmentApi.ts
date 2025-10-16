import { establishmentService } from "@/api/establishment-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateEstablishmentDto, EditEstablishmentDto } from "@/types/common/api-request.interface";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useEstablishmentApi = () => {
    const queryClient = useQueryClient();

    const useGetEstablishment = (id: string, options?: { enabled?: boolean }) => {
        return useQuery({
            queryKey: ["establishment", id],
            queryFn: () => establishmentService.getById(id).then(res => res?.data?.data || null),
            enabled: options?.enabled ?? true,
        });
    }

    //TODO: checkear si vienen las imagenes de galeria no necesarias para la lista
    const useGetEstablishments = (queryParams: string) => {
        return useQuery({
            // QueryKey ahora incluye el queryParams completo para invalidar cache correctamente
            queryKey: ["establishments", queryParams],
            queryFn: () =>
                establishmentService.getEstablishments(queryParams).then((res) => res?.data || null),
            // Opciones adicionales recomendadas
            staleTime: 1000 * 60, // Los datos son frescos por 1 minuto
            gcTime: 1000 * 60 * 5, // Mantener en cache por 5 minutos (antes era cacheTime)
        });
    };

    const useGetMyEstablishments = () => {
        return useQuery({
            queryKey: ["my-establishments"],
            queryFn: () => establishmentService.getMine().then(res => res.data.data),
        });
    }

    const createEstablishment = useMutation({
        mutationFn: (data: CreateEstablishmentDto) => establishmentService.createMine(data).then(res => res?.data?.data || null),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["establishment", "me"] });
            toast.success("Establecimiento creado");
        },
        onError: (error) => {
            if (error instanceof AxiosError) toast.error(error.response?.data.message)
            else toast.error("Error al crear el establecimiento")
        }
    });

    const updateEstablishment = useMutation({
        mutationFn: (data: EditEstablishmentDto) => establishmentService.updateMine(data.id!, data).then(res => res?.data?.data || null),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["establishment", "me"] });
            toast.success("Establecimiento actualizado");
        },
        onError: (error) => {
            if (error instanceof AxiosError) toast.error(error.response?.data.message)
            else toast.error("Error al actualizar el establecimiento")
        }
    });

    const updateEstablishmentAvatar = useMutation({
        mutationFn: ({ id, formData }: { id: string, formData: FormData }) => establishmentService.uploadAvatar(id, formData).then(res => res.data.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["establishment", "me"] });
        },
        onError: (error) => {
            if (error instanceof AxiosError) toast.error(error.response?.data.message)
            else toast.error("Error al subir la imagen")
        }
    });

    const updateEstablishmentImages = useMutation({
        mutationFn: ({ id, formData }: { id: string, formData: FormData }) => establishmentService.uploadImages(id, formData).then(res => res.data.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["establishment", "me"] });
        },
        onError: (error) => {
            if (error instanceof AxiosError) toast.error(error.response?.data.message)
            else toast.error("Error al subir las imágenes")
        }
    });

    const deleteEstablishment = useMutation({
        mutationFn: (id: string) => establishmentService.deleteMine(id).then(res => res.data.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-establishments"] });
            toast.success("Establecimiento eliminado correctamente");
        },
        onError: (error) => {
            if (error instanceof AxiosError) toast.error(error.response?.data.message)
            else toast.error("Error al eliminar el establecimiento")
        }
    });

    const deleteEstablishmentImage = useMutation({
        mutationFn: ({ id, imageId }: { id: string, imageId: string }) => establishmentService.deleteImage(id, imageId).then(res => res.data.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["establishment", "me"] });
            queryClient.refetchQueries({ queryKey: ["establishment", "me"] });
            toast.success("Imagen eliminada correctamente");
        },
        onError: (error) => {
            if (error instanceof AxiosError) toast.error(error.response?.data.message)
            else toast.error("Error al eliminar la imagen")
        }
    });

    return {
        useGetEstablishment,
        useGetEstablishments,
        useGetMyEstablishments,
        updateEstablishment,
        updateEstablishmentAvatar,
        updateEstablishmentImages,
        createEstablishment,
        deleteEstablishment,
        deleteEstablishmentImage
    };
};
