import { sponsorService } from "@/api/sponsor-service";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useSponsorsApi = () => {
  const qc = useQueryClient();

  const useGetSponsors = () => {
    return useSuspenseQuery({
      queryKey: ["sponsors"],
      queryFn: () => sponsorService.getSponsors().then((res) => res?.data),
    });
  };

  const useGetSponsorById = (id: number) => {
    return useQuery({
      queryKey: ["sponsor", id],
      queryFn: () => sponsorService.getSponsorById(id).then((res) => res?.data),
      enabled: Boolean(id),
    });
  };

  const createSponsor = useMutation({
    mutationFn: (name: string) =>
      sponsorService.createSponsor({ name }).then((res) => res?.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sponsors"] });
      toast("Patrocinador creado exitosamente");
    },
    onError: () => {
      toast.error("Error al crear el patrocinador");
    },
  });

  const updateSponsor = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      sponsorService.updateSponsor(id, name).then((res) => res?.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sponsors"] });
      toast("Patrocinador actualizado exitosamente");
    },
    onError: () => {
      toast.error("Error al actualizar el patrocinador");
    },
  });

  const uploadSponsorImage = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      sponsorService.uploadSponsorImage(id, formData).then((res) => res?.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sponsors"] }),
  });

  const deleteSponsor = useMutation({
    mutationFn: (id: number) =>
      sponsorService.deleteSponsor(id).then((res) => res?.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sponsors"] }),
  });

  return {
    useGetSponsors,
    useGetSponsorById,
    createSponsor,
    uploadSponsorImage,
    deleteSponsor,
    updateSponsor,
  };
};
