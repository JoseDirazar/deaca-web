import { categoryService } from "@/api/category-service";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSubcategoryApi = () => {
  const getSubcategories = useSuspenseQuery({
    queryFn: () =>
      categoryService.getSubcategories().then((res) => res?.data || null),
    queryKey: ["subcategories"],
  });

  const createSubcategory = useMutation({
    mutationFn: ({ categoryId, name }: { categoryId: string; name: string }) =>
      categoryService
        .createSubcategory(name, categoryId)
        .then((res) => res?.data.data || null),
    onSuccess: () => {
      toast.success("Subcategoría creada correctamente");
    },
    onError: () => {
      toast.error("Error al crear la categoría");
    },
  });

  const updateSubcategory = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: string }) =>
      categoryService
        .updateSubcategory(id, payload)
        .then((res) => res?.data.data || null),
    onSuccess: () => {
      toast.success("Subcategoría actualizada correctamente");
    },
    onError: () => {
      toast.error("Error al actualizar la categoría");
    },
  });

  const deleteSubcategory = useMutation({
    mutationFn: (id: string) => categoryService.deleteSubcategory(id),
    onSuccess: () => {
      toast.success("Subcategoría eliminada correctamente");
    },
    onError: () => {
      toast.error("Error al eliminar la categoría");
    },
  });

  return {
    getSubcategories,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
  };
};
