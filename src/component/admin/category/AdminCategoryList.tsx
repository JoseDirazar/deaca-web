import Button from "@/component/ui/Button";
import { generateImageUrl } from "@/lib/generate-image-url";
import type { Category } from "@/types/category/category.interface";
import { FaPhotoFilm } from "react-icons/fa6";
import { LuLoader } from "react-icons/lu";
import { TbTrash } from "react-icons/tb";

interface AdminCategoryList {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
  selectedCategoryId: string | null;
  editingCategoryId: string | null;
  editingCategoryName: string;
  setEditingCategoryName: (name: string) => void;
  handleUpdateCategory: (categoryId: string) => void;
  cancelEditCategory: () => void;
  startEditCategory: (category: Category) => void;
  handleDeleteCategory: (category: Category) => void;
  handleIconUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUpdatingIcon: boolean;
  iconFile: File | null;
}

export default function AdminCategoryList({
  categories,
  onSelectCategory,
  selectedCategoryId,
  editingCategoryId,
  editingCategoryName,
  setEditingCategoryName,
  handleUpdateCategory,
  cancelEditCategory,
  startEditCategory,
  handleDeleteCategory,
  handleIconUpload,
  isUpdatingIcon,
  iconFile,
}: AdminCategoryList) {
  console.log(iconFile);
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
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
              className={`flex items-center justify-between gap-2 rounded p-3 shadow ${
                selectedCategoryId === cat.id
                  ? "bg-fifth text-white shadow-lg"
                  : ""
              }`}
            >
              <div className="flex-1">
                {editingCategoryId === cat.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="photo"
                      className="hidden"
                      accept="image/*"
                      onChange={handleIconUpload}
                    />
                    <img
                      src={
                        iconFile
                          ? URL.createObjectURL(iconFile)
                          : generateImageUrl("category", cat.icon)
                      }
                      alt={cat.name}
                      className="h-16 w-16 object-contain"
                    />
                    <Button
                      type="button"
                      onClick={() => document.getElementById("photo")?.click()}
                      disabled={isUpdatingIcon}
                      icon={
                        isUpdatingIcon ? (
                          <LuLoader size={20} />
                        ) : (
                          <FaPhotoFilm size={20} />
                        )
                      }
                      className="flex items-center justify-center rounded-full p-2 text-center"
                    />
                    <input
                      className="w-full rounded-md border border-primary-hover px-3 py-2 text-fourth focus:border-primary-hover focus:ring-1 focus:ring-primary focus:outline-none"
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                    />
                    <Button
                      label="Guardar"
                      onClick={() => handleUpdateCategory(cat.id)}
                      className="text-sm font-medium"
                    />
                    <Button
                      label="Cancelar"
                      onClick={cancelEditCategory}
                      className="bg-transparent text-sm font-medium text-fourth hover:bg-fourth hover:text-white"
                    />
                  </div>
                ) : (
                  <button
                    className="flex w-full items-center gap-4 font-medium text-gray-800 hover:text-fourth"
                    onClick={() => onSelectCategory(cat)}
                  >
                    <img
                      src={generateImageUrl("category", cat.icon)}
                      alt={cat.name}
                      className="h-16 w-16 object-contain"
                    />
                    {cat.name}
                  </button>
                )}
              </div>
              {editingCategoryId !== cat.id && (
                <div className="flex items-center gap-2">
                  <Button
                    label="Editar"
                    onClick={() => startEditCategory(cat)}
                    className="rounded-md bg-transparent px-3 py-2 text-sm text-fourth hover:bg-fourth hover:text-white"
                  />
                  <Button
                    onClick={() => handleDeleteCategory(cat)}
                    className="rounded-md bg-transparent p-2 text-sm text-red-600 hover:bg-red-600 hover:text-white"
                    icon={<TbTrash />}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
