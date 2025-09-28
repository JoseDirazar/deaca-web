import { useEffect, useState } from "react";
import Input from "@/component/ui/Input";
import Button from "@/component/ui/Button";
import { categoryService } from "@/api/category-service";
import type { Category } from "@/types/category/category.interface";
import type { Subcategory } from "@/types/category/subcategory.interface";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function loadCategories() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await categoryService.getCategories();
      setCategories(data.categories || []);
    } catch (e) {
      setError("No se pudieron cargar las categorías");
    } finally {
      setLoading(false);
    }
  }

  async function loadSubcategories(catId: string) {
    setLoading(true);
    setError(null);
    try {
      const { data } = await categoryService.getSubcategoriesByCategory(catId);
      setSubcategories(data.subcategories || []);
    } catch (e) {
      setError("No se pudieron cargar las subcategorías");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  // Handlers: Categories
  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await categoryService.createCategory(newCategoryName.trim());
      setNewCategoryName("");
      await loadCategories();
    } catch (e) {
      setError("No se pudo crear la categoría");
    } finally {
      setLoading(false);
    }
  }

  function startEditCategory(category: Category) {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  }

  function cancelEditCategory() {
    setEditingCategoryId(null);
    setEditingCategoryName("");
  }

  async function handleUpdateCategory(categoryId: string) {
    if (!editingCategoryName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await categoryService.updateCategory(
        categoryId,
        editingCategoryName.trim(),
      );
      await loadCategories();
      // Update selectedCategory name if it's the one edited
      if (selectedCategory?.id === categoryId) {
        setSelectedCategory({
          ...selectedCategory,
          name: editingCategoryName.trim(),
        });
      }
      cancelEditCategory();
    } catch (e) {
      setError("No se pudo actualizar la categoría");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCategory(category: Category) {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar la categoría "${category.name}"?\nEsto eliminará también todas sus subcategorías asociadas. Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;
    setLoading(true);
    setError(null);
    try {
      await categoryService.deleteCategory(category.id);
      await loadCategories();
      if (selectedCategory?.id === category.id) {
        setSelectedCategory(null);
        setSubcategories([]);
      }
    } catch (e) {
      setError("No se pudo eliminar la categoría");
    } finally {
      setLoading(false);
    }
  }

  // Handlers: Subcategories
  async function handleCreateSubcategory(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCategory) return;
    if (!newSubcategoryName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await categoryService.createSubcategory(
        newSubcategoryName.trim(),
        selectedCategory.id,
      );
      setNewSubcategoryName("");
      await loadSubcategories(selectedCategory.id);
    } catch (e) {
      setError("No se pudo crear la subcategoría");
    } finally {
      setLoading(false);
    }
  }

  function startEditSubcategory(sub: Subcategory) {
    setEditingSubcategoryId(sub.id);
    setEditingSubcategoryName(sub.name);
  }

  function cancelEditSubcategory() {
    setEditingSubcategoryId(null);
    setEditingSubcategoryName("");
  }

  async function handleUpdateSubcategory(subcategoryId: string) {
    if (!editingSubcategoryName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await categoryService.updateSubcategory(
        subcategoryId,
        editingSubcategoryName.trim(),
      );
      if (selectedCategory) await loadSubcategories(selectedCategory.id);
      cancelEditSubcategory();
    } catch (e) {
      setError("No se pudo actualizar la subcategoría");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteSubcategory(sub: Subcategory) {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar la subcategoría "${sub.name}"? Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;
    setLoading(true);
    setError(null);
    try {
      await categoryService.deleteSubcategory(sub.id);
      if (selectedCategory) await loadSubcategories(selectedCategory.id);
    } catch (e) {
      setError("No se pudo eliminar la subcategoría");
    } finally {
      setLoading(false);
    }
  }

  function onSelectCategory(category: Category) {
    setSelectedCategory(category);
    loadSubcategories(category.id);
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Categorías</h1>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <span>Procesando...</span>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
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
                    selectedCategory?.id === cat.id
                      ? "bg-primary text-white"
                      : ""
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
