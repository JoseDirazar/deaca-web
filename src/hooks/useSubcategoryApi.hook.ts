import { categoryService } from "@/api/category-service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useSubcategoryApi = () => {
    const qc = useQueryClient()

    const getSubcategories = useQuery({
        queryFn: () => categoryService.getSubcategories().then((res: any) => res?.data || null),
        queryKey: ["subcategories"],
    })

    const createSubcategory = useMutation({
        mutationFn: ({ categoryId, name }: { categoryId: string, name: string }) => categoryService.createSubcategory(name, categoryId).then((res: any) => res?.data.data || null),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["subcategories"] })
            qc.invalidateQueries({ queryKey: ["categories"] })
            toast.success("Subcategoría creada correctamente")
        },
        onError: () => {
            toast.error("Error al crear la categoría")
        }
    })

    const updateSubcategory = useMutation({
        mutationFn: ({ id, payload }: { id: string, payload: string }) => categoryService.updateSubcategory(id, payload).then((res: any) => res?.data.data || null),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["subcategories"] })
            qc.invalidateQueries({ queryKey: ["categories"] })
            toast.success("Subcategoría actualizada correctamente")
        },
        onError: () => {
            toast.error("Error al actualizar la categoría")
        }
    })

    const deleteSubcategory = useMutation({
        mutationFn: (id: string) => categoryService.deleteSubcategory(id).then((res: any) => res?.data.data || null),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["subcategories"] })
            qc.invalidateQueries({ queryKey: ["categories"] })
            toast.success("Subcategoría eliminada correctamente")
        },
        onError: () => {
            toast.error("Error al eliminar la categoría")
        }
    })

    return {
        getSubcategories,
        createSubcategory,
        updateSubcategory,
        deleteSubcategory
    }
}