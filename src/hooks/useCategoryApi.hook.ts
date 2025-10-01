import { categoryService } from "@/api/category-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCategoryApi = () => {
    const qc = useQueryClient();

    const getCategories = useQuery({
        queryFn: () => categoryService.getCategories().then((res) => res?.data.data || null),
        queryKey: ["categories"],
    })

    const createCategory = useMutation({
        mutationFn: (payload: string) => categoryService.createCategory(payload).then((res) => res?.data.data || null),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["categories"] })
            toast.success("Categoría creada correctamente")
        },
        onError: () => {
            toast.error("Error al crear la categoría")
        }
    })

    const updateCategory = useMutation({
        mutationFn: ({ id, payload }: { id: string, payload: string }) => categoryService.updateCategory(id, payload).then((res) => res?.data.data || null),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["categories"] })
            toast.success("Categoría actualizada correctamente")
        },
        onError: () => {
            toast.error("Error al actualizar la categoría")
        }
    })

    const deleteCategory = useMutation({
        mutationFn: (id: string) => categoryService.deleteCategory(id).then((res) => res?.data || null),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["categories"] })
            toast.success("Categoría eliminada correctamente")
        },
        onError: () => {
            toast.error("Error al eliminar la categoría")
        }
    })

    return {
        getCategories,
        createCategory,
        updateCategory,
        deleteCategory
    }
};
