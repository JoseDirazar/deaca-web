import api from "./axios-instance";
import type { CreateCategoryResponse, CreateSubcategoryResponse, DeleteCategoryResponse, DeleteSubcategoryResponse, GetCategoriesResponse, GetSubcategoriesByCategoryResponse, GetSubcategoriesResponse, UpdateCategoryResponse, UpdateSubcategoryResponse } from "@/types/common/api-response.interface";

export const categoryService = {
  // Categories
  getCategories: ({ exclude, select }: { exclude?: string[], select?: string[] }): GetCategoriesResponse => {
    const params = new URLSearchParams();
    if (exclude) {
      exclude.forEach((value) => params.append("exclude", value));
    }
    if (select) {
      select.forEach((value) => params.append("select", value));
    }
    return api.get(`/category?${params.toString()}`);
  },

  getSubcategories: (): GetSubcategoriesResponse => api.get("/category/subcategories"),

  createCategory: (name: string): CreateCategoryResponse =>
    api.post("/category", { name }),
  uploadCategoryIcon: (id: string, formData: FormData): UpdateCategoryResponse => api.putForm(`/category/${id}/icon`, formData),

  createSubcategory: (categoryId: string, name: string): CreateSubcategoryResponse => api.post("/category/subcategories", { name, categoryId }),

  updateCategory: (
    id: string,
    name: string,
  ): UpdateCategoryResponse => api.put(`/category/${id}`, { name }),
  updateSubcategory: (
    id: string,
    name: string,
  ): UpdateSubcategoryResponse =>
    api.put(`/category/subcategories/${id}`, { name }),

  deleteCategory: (id: string): DeleteCategoryResponse =>
    api.delete(`/category/${id}`),

  deleteSubcategory: (id: string): DeleteSubcategoryResponse =>
    api.delete(`/category/subcategories/${id}`),

  // Subcategories
  getSubcategoriesByCategory: (
    categoryId: string,
  ): GetSubcategoriesByCategoryResponse =>
    api.get(`/category/${categoryId}/subcategories`),

};
