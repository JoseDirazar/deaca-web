import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/api/category-service";
import type { Establishment } from "@/types/establishment/etablihment.interface";
import type { Category } from "@/types/category/category.interface";
import type { Subcategory } from "@/types/category/subcategory.interface";
import Input from "@/component/ui/Input";
import Button from "@/component/ui/Button";
import { useCreateEstablishment } from "@/hooks/useCreateEstablishment.hook";
import { useGetMyEstablishment } from "@/hooks/useGetMyEstablishments.hook";

export default function UserEstablishmentPage() {
  const {
    myEstablishments,
    isPending: isLoadingMine,
    refetch,
  } = useGetMyEstablishment();

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: () => categoryService.getCategories(),
  });
  const categories: Category[] = categoriesRes?.data.categories ?? [];

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [availableSubcategories, setAvailableSubcategories] = useState<
    Subcategory[]
  >([]);
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<
    string[]
  >([]);

  const [form, setForm] = useState<Partial<Establishment>>({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    avatar: "",
    instagram: "",
    facebook: "",
    latitude: "",
    longitude: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);

  const { createEstablishmentAsync, isLoading: isCreating } =
    useCreateEstablishment();

  useEffect(() => {
    const subs = categories
      .filter((c) => selectedCategoryIds.includes(c.id))
      .flatMap((c) => c.subcategories || []);
    setAvailableSubcategories(subs);
    setSelectedSubcategoryIds((prev) =>
      prev.filter((id) => subs.some((s) => s.id === id)),
    );
  }, [selectedCategoryIds, categories]);

  const resetForm = () => {
    setForm({
      name: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      description: "",
      avatar: "",
      instagram: "",
      facebook: "",
      latitude: "",
      longitude: "",
    });
    setSelectedCategoryIds([]);
    setSelectedSubcategoryIds([]);
    setAvatarFile(null);
    setGalleryFiles(null);
  };

  // (editing removed for dev minimal)

  async function handleCreate() {
    // Minimal payload for dev: name + at least 1 category + avatar
    const payload: any = {
      name: form.name,
      categories: selectedCategoryIds.map((id) => ({ id })),
    };
    const res = await createEstablishmentAsync(payload);
    const created = res?.data.data;
    // Upload avatar if provided (required in dev minimal)
    if (created && avatarFile) {
      const { uploadAvatar } = await import("@/api/establishment-service").then(
        (m) => m.establishmentService,
      );
      await uploadAvatar(created.id, avatarFile);
    }
    // Optionally upload gallery images (not required for dev minimal)
    if (created && galleryFiles && galleryFiles.length > 0) {
      const { uploadImage } = await import("@/api/establishment-service").then(
        (m) => m.establishmentService,
      );
      for (const f of Array.from(galleryFiles)) {
        await uploadImage(created.id, f);
      }
    }
    await refetch();
    resetForm();
  }

  console.log(selectedSubcategoryIds);
  const canSubmit = useMemo(() => {
    // Dev minimal: name + at least 1 category + avatar selected
    const nameOk = (form.name?.trim() || "").length > 0;
    const hasCategory = selectedCategoryIds.length >= 1;
    const hasAvatar = Boolean(avatarFile);
    return nameOk && hasCategory && hasAvatar;
  }, [form.name, selectedCategoryIds, avatarFile]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Mis establecimientos
        </h1>
        <Button label="Nuevo establecimiento" onClick={resetForm} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-3 md:col-span-1">
          {isLoadingMine ? (
            <div className="text-gray-500">Cargando...</div>
          ) : myEstablishments.length === 0 ? (
            <div className="text-gray-500">Aún no tienes establecimientos.</div>
          ) : (
            myEstablishments.map((e: Establishment) => (
              <div key={e.id} className={"rounded border border-gray-200 p-3"}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{e.name}</div>
                    <div className="text-sm text-gray-500">{e.address}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-1 text-xs ${e.isComplete ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                    >
                      {e.isComplete ? "Completo" : "Incompleto"}
                    </span>
                    <span
                      className={`rounded px-2 py-1 text-xs ${e.verified ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
                    >
                      {e.verified ? "Verificado" : "Sin verificar"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="md:col-span-2">
          <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                id="name"
                type="text"
                title="Nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                id="address"
                type="text"
                title="Dirección"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
              <Input
                id="phone"
                type="tel"
                title="Teléfono"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <Input
                id="email"
                type="email"
                title="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                id="website"
                type="url"
                title="Website"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
              <Input
                id="instagram"
                type="text"
                title="Instagram"
                value={form.instagram}
                onChange={(e) =>
                  setForm({ ...form, instagram: e.target.value })
                }
              />
              <Input
                id="facebook"
                type="text"
                title="Facebook"
                value={form.facebook}
                onChange={(e) => setForm({ ...form, facebook: e.target.value })}
              />
              <Input
                id="latitude"
                type="text"
                title="Latitud"
                value={form.latitude}
                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              />
              <Input
                id="longitude"
                type="text"
                title="Longitud"
                value={form.longitude}
                onChange={(e) =>
                  setForm({ ...form, longitude: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Categorías (mín. 1)
                </label>
                <select
                  multiple
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={selectedCategoryIds}
                  onChange={(e) =>
                    setSelectedCategoryIds(
                      Array.from(e.target.selectedOptions).map((o) => o.value),
                    )
                  }
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Subcategorías (mín. 1)
                </label>
                <select
                  multiple
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={selectedSubcategoryIds}
                  onChange={(e) =>
                    setSelectedSubcategoryIds(
                      Array.from(e.target.selectedOptions).map((o) => o.value),
                    )
                  }
                >
                  {availableSubcategories.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Avatar del establecimiento
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Galería (mín. 5 imágenes)
                </label>
                <input
                  multiple
                  type="file"
                  accept="image/*"
                  onChange={(e) => setGalleryFiles(e.target.files)}
                />
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Para completar el perfil: avatar + al menos 5 imágenes, 1
              categoría y 1 subcategoría.
            </div>

            <div className="flex items-center gap-3">
              <Button
                label={isCreating ? "Creando..." : "Crear establecimiento"}
                disabled={!canSubmit || isCreating}
                onClick={handleCreate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
