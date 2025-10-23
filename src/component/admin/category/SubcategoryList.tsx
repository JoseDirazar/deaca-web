import Button from "@/component/ui/Button";
import Input from "@/component/ui/Input";
import type { Category } from "@/types/category/category.interface";
import type { Subcategory } from "@/types/category/subcategory.interface";
import type { FormEvent } from "react";
import { TbTrash } from "react-icons/tb";

interface SubcategoryListProps {
  subcategories: Subcategory[];
  editingSubcategoryId: string | null;
  editingSubcategoryName: string;
  setEditingSubcategoryName: (name: string) => void;
  handleUpdateSubcategory: (subcategoryId: string) => void;
  cancelEditSubcategory: () => void;
  startEditSubcategory: (sub: Subcategory) => void;
  handleDeleteSubcategory: (sub: Subcategory) => void;
  selectedCategory: Category | null;
  handleCreateSubcategory: (
    e: FormEvent<Element>,
  ) => Promise<string | number | undefined>;
  newSubcategoryName: string;
  setNewSubcategoryName: (name: string) => void;
}

export default function SubcategoryList({
  subcategories,
  editingSubcategoryId,
  editingSubcategoryName,
  setEditingSubcategoryName,
  handleUpdateSubcategory,
  cancelEditSubcategory,
  startEditSubcategory,
  handleDeleteSubcategory,
  selectedCategory,
  handleCreateSubcategory,
  newSubcategoryName,
  setNewSubcategoryName,
}: SubcategoryListProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
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
                title={`Crear (${selectedCategory.name})`}
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
                          className="w-full rounded-md border border-primary-hover px-3 py-2 text-fourth focus:border-primary-hover focus:ring-1 focus:ring-primary focus:outline-none"
                          value={editingSubcategoryName}
                          onChange={(e) =>
                            setEditingSubcategoryName(e.target.value)
                          }
                        />
                        <Button
                          label="Guardar"
                          onClick={() => handleUpdateSubcategory(sub.id)}
                        />
                        <Button
                          label="Cancelar"
                          onClick={cancelEditSubcategory}
                          className="bg-transparent text-fourth hover:bg-fourth hover:text-white"
                        />
                      </div>
                    ) : (
                      <span className="font-medium text-gray-800">
                        {sub.name}
                      </span>
                    )}
                  </div>
                  {editingSubcategoryId !== sub.id && (
                    <div className="flex items-center gap-2">
                      <Button
                        label="Editar"
                        onClick={() => startEditSubcategory(sub)}
                        className="rounded-md bg-transparent px-3 py-2 text-sm text-fourth hover:bg-fourth hover:text-white"
                      />
                      <Button
                        onClick={() => handleDeleteSubcategory(sub)}
                        className="rounded-md bg-transparent p-2 text-sm text-red-600 hover:bg-red-600 hover:text-white"
                        icon={<TbTrash />}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
