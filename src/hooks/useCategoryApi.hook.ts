import { categoryService } from "@/api/category-service";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useCategoryApi = () => {
  const useGetCategories = ({
    exclude,
    select,
  }: {
    exclude?: string[];
    select?: string[];
  }) => {
    return useSuspenseQuery({
      queryFn: () =>
        categoryService
          .getCategories({ exclude, select })
          .then((res) => res?.data),
      queryKey: ["categories", { exclude, select }],
    });
  };

  const createCategory = useMutation({
    mutationFn: (payload: string) =>
      categoryService.createCategory(payload).then((res) => res?.data),
    onSuccess: () => {
      toast.success("Categoría creada correctamente");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Error al crear la categoría");
      }
    },
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: string }) =>
      categoryService.updateCategory(id, payload).then((res) => res?.data),
    onSuccess: () => {
      toast.success("Categoría actualizada correctamente");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Error al actualizar la categoría");
      }
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) =>
      categoryService.deleteCategory(id).then((res) => res?.data),
    onSuccess: () => {
      toast.success("Categoría eliminada correctamente");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Error al eliminar la categoría");
      }
    },
  });

  const uploadCategoryIcon = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      categoryService.uploadCategoryIcon(id, formData).then((res) => res?.data),
    onSuccess: () => {},
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Error al subir el icono de la categoría");
      }
    },
  });

  return {
    useGetCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    uploadCategoryIcon,
  };
};
