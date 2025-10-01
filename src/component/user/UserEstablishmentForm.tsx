import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import type { Subcategory } from "@/types/category/subcategory.interface";
import type { Establishment } from "@/types/establishment/etablihment.interface";
import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";
import type { CreateEstablishmentDto } from "@/types/common/api-request.interface";
import { useCategoryApi } from "@/hooks/useCategoryApi.hook";

interface UserEstablishmentFormProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export default function UserEstablishmentForm({
  setShowModal,
}: UserEstablishmentFormProps) {
  const {
    createEstablishment,
    updateEstablishmentAvatar,
    updateEstablishmentImages,
  } = useEstablishmentApi();
  const { getCategories } = useCategoryApi();
  const {
    data: categories,
    isPending: isLoadingCategories,
    isError: isErrorCategories,
    error: errorCategories,
  } = getCategories;

  const isLoading =
    createEstablishment.isPending ||
    updateEstablishmentAvatar.isPending ||
    updateEstablishmentImages.isPending ||
    isLoadingCategories;

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

  useEffect(() => {
    const subs = categories
      ?.filter((c) => selectedCategoryIds.includes(c.id))
      .flatMap((c) => c.subcategories || []);
    setAvailableSubcategories(subs || []);
    setSelectedSubcategoryIds((prev) =>
      prev.filter((id) => subs?.some((s) => s.id === id)),
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

  function handleCreate() {
    if (!canSubmit) return;

    const payload: CreateEstablishmentDto = {
      name: form.name,
      categories: selectedCategoryIds.map((id) => ({ id })),
      subcategories: selectedSubcategoryIds.map((id) => ({ id })),
      address: form.address,
      phone: form.phone,
      email: form.email,
      website: form.website,
      description: form.description,
      instagram: form.instagram,
      facebook: form.facebook,
      latitude: form.latitude,
      longitude: form.longitude,
    };

    createEstablishment.mutate(payload, {
      onSuccess: async (created) => {
        // Upload avatar if provided
        if (created && avatarFile) {
          const formData = new FormData();
          formData.append("file", avatarFile);
          await updateEstablishmentAvatar.mutateAsync({
            id: created.id,
            formData,
          });
        }
        // Upload gallery images if provided
        if (created && galleryFiles && galleryFiles.length > 0) {
          const formData = new FormData();
          for (const f of Array.from(galleryFiles)) {
            formData.append("files", f);
          }
          await updateEstablishmentImages.mutateAsync({
            id: created.id,
            formData,
          });
        }
        resetForm();
        setShowModal(false);
      },
    });
  }

  const canSubmit = useMemo(() => {
    // Dev minimal: name + at least 1 category + avatar selected
    const nameOk = (form.name?.trim() || "").length > 0;
    const hasCategory = selectedCategoryIds.length >= 1;
    const hasAvatar = Boolean(avatarFile);
    return nameOk && hasCategory && hasAvatar;
  }, [form.name, selectedCategoryIds, avatarFile]);
  console.log(galleryFiles);

  return (
    <div className="bg-green-200 md:col-span-2">
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
            id="description"
            type="text"
            title="Descripción"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
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
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
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
            onChange={(e) => setForm({ ...form, longitude: e.target.value })}
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
              {categories?.map((c) => (
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
          Para completar el perfil: avatar + al menos 5 imágenes, 1 categoría y
          1 subcategoría.
        </div>

        <div className="flex items-center gap-3">
          <Button
            label={isLoading ? "Creando..." : "Crear establecimiento"}
            disabled={!canSubmit || isLoading}
            onClick={handleCreate}
          />
        </div>

        <div>
          <Button
            label="Cancelar"
            type="button"
            onClick={() => setShowModal(false)}
          />
        </div>
      </div>
    </div>
  );
}
