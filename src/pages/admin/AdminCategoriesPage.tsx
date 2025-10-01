import { useState, useMemo } from "react";
import Input from "@/component/ui/Input";
import Button from "@/component/ui/Button";
import { useCategoryApi } from "@/hooks/useCategoryApi.hook";
import { useSubcategoryApi } from "@/hooks/useSubcategoryApi.hook";
import type { Category } from "@/types/category/category.interface";
import type { Subcategory } from "@/types/category/subcategory.interface";

export default function AdminCategoriesPage() {
  const { getCategories, createCategory, updateCategory, deleteCategory } =
    useCategoryApi();
  const { createSubcategory, updateSubcategory, deleteSubcategory } =
    useSubcategoryApi();
  console.log(getCategories.data);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [editingCategoryName, setEditingCategoryName] = useState("");

  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<
    string | null
  >(null);
  const [editingSubcategoryName, setEditingSubcategoryName] = useState("");

  // Get categories from React Query
  const categories = getCategories?.data || [];
  const isLoading =
    getCategories.isLoading ||
    createCategory.isPending ||
    updateCategory.isPending ||
    deleteCategory.isPending ||
    createSubcategory.isPending ||
    updateSubcategory.isPending ||
    deleteSubcategory.isPending;

  // Get selected category and its subcategories from the categories data
  const selectedCategory = useMemo(() => {
    return categories.find((cat) => cat.id === selectedCategoryId) || null;
  }, [categories, selectedCategoryId]);

  const subcategories = selectedCategory?.subcategories || [];

  // Handlers: Categories
  function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    createCategory.mutate(newCategoryName.trim(), {
      onSuccess: () => {
        setNewCategoryName("");
      },
    });
  }

  function startEditCategory(category: Category) {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  }

  function cancelEditCategory() {
    setEditingCategoryId(null);
    setEditingCategoryName("");
  }

  function handleUpdateCategory(categoryId: string) {
    if (!editingCategoryName.trim()) return;
    updateCategory.mutate(
      { id: categoryId, payload: editingCategoryName.trim() },
      {
        onSuccess: () => {
          cancelEditCategory();
        },
      },
    );
  }

  function handleDeleteCategory(category: Category) {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar la categoría "${category.name}"?\nEsto eliminará también todas sus subcategorías asociadas. Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;
    deleteCategory.mutate(category.id, {
      onSuccess: () => {
        if (selectedCategoryId === category.id) {
          setSelectedCategoryId(null);
        }
      },
    });
  }

  // Handlers: Subcategories
  function handleCreateSubcategory(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCategoryId) return;
    if (!newSubcategoryName.trim()) return;
    createSubcategory.mutate(
      { categoryId: selectedCategoryId, name: newSubcategoryName.trim() },
      {
        onSuccess: () => {
          setNewSubcategoryName("");
        },
      },
    );
  }

  function startEditSubcategory(sub: Subcategory) {
    setEditingSubcategoryId(sub.id);
    setEditingSubcategoryName(sub.name);
  }

  function cancelEditSubcategory() {
    setEditingSubcategoryId(null);
    setEditingSubcategoryName("");
  }

  function handleUpdateSubcategory(subcategoryId: string) {
    if (!editingSubcategoryName.trim()) return;
    updateSubcategory.mutate(
      { id: subcategoryId, payload: editingSubcategoryName.trim() },
      {
        onSuccess: () => {
          cancelEditSubcategory();
        },
      },
    );
  }

  function handleDeleteSubcategory(sub: Subcategory) {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar la subcategoría "${sub.name}"? Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;
    deleteSubcategory.mutate(sub.id);
  }

  function onSelectCategory(category: Category) {
    setSelectedCategoryId(category.id);
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Categorías</h1>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <span>Procesando...</span>
          </div>
        )}
      </div>

      {getCategories.isError && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-red-700">
          Error al cargar las categorías
        </div>
      )}

      {/* Create Category */}
      <form
        onSubmit={handleCreateCategory}
        className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-fifth p-4 shadow-sm md:flex-row md:items-end"
      >
        <div className="flex-1">
          <Input
            id="categoryName"
            type="text"
            title="Nueva categoría"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
          />
        </div>
        <Button type="submit" label="Crear" />
      </form>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Categories List */}
        <div className="rounded-lg border border-gray-200 bg-fifth p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">Listado</h2>
          <div className="divide-y divide-gray-100">
            {categories.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No hay categorías creadas
              </div>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`flex items-center justify-between gap-2 py-3 ${
                    selectedCategoryId === cat.id ? "bg-primary text-white" : ""
                  }`}
                >
                  <div className="flex-1">
                    {editingCategoryId === cat.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          value={editingCategoryName}
                          onChange={(e) =>
                            setEditingCategoryName(e.target.value)
                          }
                        />
                        <Button
                          label="Guardar"
                          onClick={() => handleUpdateCategory(cat.id)}
                        />
                        <button
                          className="rounded-md px-3 py-2 text-sm hover:bg-fourth"
                          type="button"
                          onClick={cancelEditCategory}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        className="text-left font-medium text-gray-800 hover:text-blue-600"
                        onClick={() => onSelectCategory(cat)}
                      >
                        {cat.name}
                      </button>
                    )}
                  </div>
                  {editingCategoryId !== cat.id && (
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-md px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
                        onClick={() => startEditCategory(cat)}
                      >
                        Editar
                      </button>
                      <button
                        className="rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteCategory(cat)}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Subcategories Panel */}
        <div className="rounded-lg border border-gray-200 bg-fifth p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            Subcategorías
          </h2>
          {!selectedCategory ? (
            <div className="py-8 text-center text-gray-500">
              Selecciona una categoría para ver sus subcategorías
            </div>
          ) : (
            <>
              {/* Create Subcategory */}
              <form
                onSubmit={handleCreateSubcategory}
                className="mb-4 flex flex-col gap-3 rounded-md border border-gray-100 p-3 md:flex-row md:items-end"
              >
                <div className="flex-1">
                  <Input
                    id="subcategoryName"
                    type="text"
                    title={`Nueva subcategoría para "${selectedCategory.name}"`}
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" label="Crear" />
              </form>

              {/* Subcategories list */}
              <div className="divide-y divide-gray-100">
                {subcategories.length === 0 ? (
                  <div className="py-6 text-center text-gray-500">
                    No hay subcategorías para esta categoría
                  </div>
                ) : (
                  subcategories.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between gap-2 py-3"
                    >
                      <div className="flex-1">
                        {editingSubcategoryId === sub.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                              value={editingSubcategoryName}
                              onChange={(e) =>
                                setEditingSubcategoryName(e.target.value)
                              }
                            />
                            <Button
                              label="Guardar"
                              onClick={() => handleUpdateSubcategory(sub.id)}
                            />
                            <button
                              className="rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
                              type="button"
                              onClick={cancelEditSubcategory}
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <span className="font-medium text-gray-800">
                            {sub.name}
                          </span>
                        )}
                      </div>
                      {editingSubcategoryId !== sub.id && (
                        <div className="flex items-center gap-2">
                          <button
                            className="rounded-md px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
                            onClick={() => startEditSubcategory(sub)}
                          >
                            Editar
                          </button>
                          <button
                            className="rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteSubcategory(sub)}
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
