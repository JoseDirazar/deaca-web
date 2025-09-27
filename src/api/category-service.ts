import api from "./axios-instance";
import type { Category } from "@/types/category/category.interface";
import type { Subcategory } from "@/types/category/subcategory.interface";

export const categoryService = {
  // Categories
  getCategories: (): Promise<{ data: { categories: Category[] } }> =>
    api.get("/category"),

  createCategory: (name: string): Promise<{ data: { category: Category } }> =>
    api.post("/category", { name }),

  updateCategory: (
    id: string,
    name: string,
  ): Promise<{ data: { category: Category } }> => api.put(`/category/${id}`, { name }),

  deleteCategory: (id: string): Promise<{ data: { category: Category } }> =>
    api.delete(`/category/${id}`),

  // Subcategories
  getSubcategoriesByCategory: (
    categoryId: string,
  ): Promise<{ data: { subcategories: Subcategory[] } }> =>
    api.get(`/category/${categoryId}/subcategories`),

  createSubcategory: (
    name: string,
    categoryId: string,
  ): Promise<{ data: { subcategory: Subcategory } }> =>
    api.post("/category/subcategories", { name, categoryId }),

  updateSubcategory: (
    id: string,
    name: string,
  ): Promise<{ data: { subcategory: Subcategory } }> =>
    api.put(`/category/subcategories/${id}`, { name }),

  deleteSubcategory: (
    id: string,
  ): Promise<{ data: { subcategory: Subcategory } }> => api.delete(`/category/subcategories/${id}`),
};
