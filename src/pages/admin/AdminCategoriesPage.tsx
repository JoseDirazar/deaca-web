import { useState, useMemo } from "react";

import { useCategoryApi } from "@/hooks/useCategoryApi.hook";
import { useSubcategoryApi } from "@/hooks/useSubcategoryApi.hook";
import type { Category } from "@/types/category/category.interface";
import type { Subcategory } from "@/types/category/subcategory.interface";
import { toast } from "sonner";
import PageHeader from "@/component/PageHeader";
import { categoryService } from "@/api/category-service";
import { useSuspenseQuery } from "@tanstack/react-query";

import SubcategoryList from "@/component/admin/category/SubcategoryList";
import CreateCategoryForm from "@/component/admin/category/CreateCategoryForm";
import AdminCategoryList from "@/component/admin/category/AdminCategoryList";
import Modal from "@/component/ui/Modal";
import Button from "@/component/ui/Button";
import { FaPlus } from "react-icons/fa6";

export default function AdminCategoriesPage() {
  const { data } = useSuspenseQuery({
    queryKey: ["categories"],
    queryFn: () =>
      categoryService.getCategories({}).then((res) => res.data.data),
  });
  const [isOpen, setIsOpen] = useState(false);
  const { createCategory, updateCategory, deleteCategory, uploadCategoryIcon } =
    useCategoryApi();
  const { createSubcategory, updateSubcategory, deleteSubcategory } =
    useSubcategoryApi();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<
    string | null
  >(null);
  const [editingSubcategoryName, setEditingSubcategoryName] = useState("");

  // Get categories from React Query
  const categories = useMemo(() => data || [], [data]);

  // Get selected category and its subcategories from the categories data
  const selectedCategory = useMemo(() => {
    return categories.find((cat) => cat.id === selectedCategoryId) || null;
  }, [categories, selectedCategoryId]);

  const subcategories = selectedCategory?.subcategories || [];

  // Handlers: Categories
  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim())
      return toast.warning("Ingresa un nombre para la nueva categoria.");
    if (!iconFile)
      return toast.warning("Selecciona un icono para la nueva categoria.");
    const form = new FormData();
    form.append("file", iconFile);
    const { data: categoryCreated } = await createCategory.mutateAsync(
      newCategoryName.trim(),
      {
        onSuccess: () => {
          setNewCategoryName("");
        },
      },
    );
    await uploadCategoryIcon.mutateAsync({
      id: categoryCreated.id,
      formData: form,
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
  async function handleCreateSubcategory(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCategoryId) return;
    if (!newSubcategoryName.trim() || !iconFile)
      return toast.warning("Por favor, completa todos los campos.");
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

  async function handleDeleteSubcategory(sub: Subcategory) {
    try {
      const confirmed = window.confirm(
        `¿Seguro que deseas eliminar la subcategoría "${sub.name}"? Esta acción no se puede deshacer.`,
      );
      if (!confirmed) return;
      await deleteSubcategory.mutateAsync(sub.id);
    } catch (error) {
      console.error(error);
    }
  }

  function onSelectCategory(category: Category) {
    setSelectedCategoryId(category.id);
  }

  function handleIconUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editingCategoryId) return;
    const formData = new FormData();
    formData.append("file", file);

    setIconFile(file);
    uploadCategoryIcon.mutate({
      id: editingCategoryId,
      formData,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Categorías"
          description={`${categories.length} categoría${categories.length !== 1 ? "s" : ""}`}
        />
        <Button
          icon={<FaPlus />}
          onClick={() => setIsOpen(true)}
          className="w-fit"
        />
      </div>

      <Modal setIsOpen={() => setIsOpen(false)} isOpen={isOpen}>
        <CreateCategoryForm
          handleCreateCategory={handleCreateCategory}
          setIconFile={setIconFile}
          newCategoryName={newCategoryName}
          setNewCategoryName={setNewCategoryName}
          isPending={createCategory.isPending}
        />
      </Modal>

      <AdminCategoryList
        categories={categories}
        iconFile={iconFile}
        onSelectCategory={onSelectCategory}
        selectedCategoryId={selectedCategoryId}
        editingCategoryId={editingCategoryId}
        editingCategoryName={editingCategoryName}
        setEditingCategoryName={setEditingCategoryName}
        handleUpdateCategory={handleUpdateCategory}
        cancelEditCategory={cancelEditCategory}
        startEditCategory={startEditCategory}
        handleDeleteCategory={handleDeleteCategory}
        handleIconUpload={handleIconUpload}
        isUpdatingIcon={uploadCategoryIcon.isPending}
      />

      {selectedCategoryId && (
        <Modal
          setIsOpen={() => setSelectedCategoryId(null)}
          isOpen={!!selectedCategoryId}
        >
          <SubcategoryList
            subcategories={subcategories}
            editingSubcategoryId={editingSubcategoryId}
            editingSubcategoryName={editingSubcategoryName}
            setEditingSubcategoryName={setEditingSubcategoryName}
            handleUpdateSubcategory={handleUpdateSubcategory}
            cancelEditSubcategory={cancelEditSubcategory}
            startEditSubcategory={startEditSubcategory}
            handleDeleteSubcategory={handleDeleteSubcategory}
            selectedCategory={selectedCategory}
            handleCreateSubcategory={handleCreateSubcategory}
            newSubcategoryName={newSubcategoryName}
            setNewSubcategoryName={setNewSubcategoryName}
          />
        </Modal>
      )}
    </div>
  );
}
