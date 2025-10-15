import { useEffect, useMemo, useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import ImageUpload from "../ui/ImageUpload";
import type { Subcategory } from "@/types/category/subcategory.interface";
import type { Establishment } from "@/types/establishment/etablihment.interface";
import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";
import type { CreateEstablishmentDto } from "@/types/common/api-request.interface";
import { useCategoryApi } from "@/hooks/useCategoryApi.hook";
import { generateImageUrl } from "@/lib/generate-image-url";
import { useLocation, useNavigate } from "react-router";
import SectionContainer from "../ui/section/SectionContainer";
import type { Image } from "@/types/common/image.interface";

interface UserEstablishmentFormProps {
  establishment?: Establishment | null;
}

export default function UserEstablishmentForm({
  establishment,
}: UserEstablishmentFormProps) {
  const isEditMode = Boolean(establishment);
  const navigate = useNavigate();
  const from = useLocation().state?.from ?? "/usuario/emprendimientos";
  const {
    createEstablishment,
    updateEstablishment,
    updateEstablishmentAvatar,
    updateEstablishmentImages,
    deleteEstablishmentImage,
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
  const [currentCategoryId, setCurrentCategoryId] = useState<string>("");
  const [currentSubcategoryId, setCurrentSubcategoryId] = useState<string>("");
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
  const [existingImages, setExistingImages] = useState<Image[]>([]);

  useEffect(() => {
    const subs = categories
      ?.filter((c) => selectedCategoryIds.includes(c.id))
      .flatMap((c) => c.subcategories || []);
    setAvailableSubcategories(subs || []);
    setSelectedSubcategoryIds((prev) =>
      prev.filter((id) => subs?.some((s) => s.id === id)),
    );
  }, [selectedCategoryIds, categories]);

  useEffect(() => {
    if (establishment) {
      setForm({
        name: establishment.name || "",
        address: establishment.address || "",
        phone: establishment.phone || "",
        email: establishment.email || "",
        website: establishment.website || "",
        description: establishment.description || "",
        avatar: establishment.avatar || "",
        instagram: establishment.instagram || "",
        facebook: establishment.facebook || "",
        latitude: establishment.latitude || "",
        longitude: establishment.longitude || "",
      });
      setSelectedCategoryIds(
        establishment.categories
          ?.map((c) => c.id)
          .filter((id): id is string => Boolean(id)) || [],
      );
      setSelectedSubcategoryIds(
        establishment.subcategories
          ?.map((s) => s.id)
          .filter((id): id is string => Boolean(id)) || [],
      );
      setExistingImages(establishment.images || []);
    }
  }, [establishment]);

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
        navigate(from);
      },
    });
  }

  async function handleUpdate() {
    if (!establishment || !canSubmit) return;

    const payload = {
      id: establishment.id,
      createdAt: establishment.createdAt,
      updatedAt: establishment.updatedAt,
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

    try {
      await updateEstablishment.mutateAsync(payload);

      // Upload new avatar if provided
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        await updateEstablishmentAvatar.mutateAsync({
          id: establishment.id,
          formData,
        });
      }

      // Upload new gallery images if provided
      if (galleryFiles && galleryFiles.length > 0) {
        const formData = new FormData();
        for (const f of Array.from(galleryFiles)) {
          formData.append("files", f);
        }
        await updateEstablishmentImages.mutateAsync({
          id: establishment.id,
          formData,
        });
      }
      navigate(from);
      resetForm();
    } catch (error) {
      console.error("Error updating establishment:", error);
    }
  }
  const canSubmit = useMemo(() => {
    // Dev minimal: name + at least 1 category + avatar (file or existing)
    const nameOk = (form.name?.trim() || "").length > 0;
    const hasCategory = selectedCategoryIds.length >= 1;
    const hasAvatar =
      Boolean(avatarFile) || (isEditMode && Boolean(form.avatar));
    return nameOk && hasCategory && hasAvatar;
  }, [form.name, selectedCategoryIds, avatarFile, isEditMode, form.avatar]);

  const handleDeleteImage = (imageId: string) => {
    if (!establishment) return;
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    deleteEstablishmentImage.mutate({ id: establishment.id, imageId });
  };

  return (
    <SectionContainer className="md:col-span-2">
      <p className="mb-6 text-2xl font-bold text-primary">
        {isEditMode ? "Editar establecimiento" : "Nuevo establecimiento"}
      </p>
      <div className="space-y-4 rounded-lg">
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
            <label className="mb-1 block text-sm font-extrabold text-primary">
              Categorías (mín. 1)
            </label>
            <div className="flex gap-2">
              <select
                className="flex-1 rounded-md border border-primary p-2 text-primary"
                value={currentCategoryId}
                onChange={(e) => setCurrentCategoryId(e.target.value)}
              >
                <option value="">Seleccionar categoría...</option>
                {categories
                  ?.filter((c) => !selectedCategoryIds.includes(c.id))
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  if (
                    currentCategoryId &&
                    !selectedCategoryIds.includes(currentCategoryId)
                  ) {
                    setSelectedCategoryIds([
                      ...selectedCategoryIds,
                      currentCategoryId,
                    ]);
                    setCurrentCategoryId("");
                  }
                }}
                disabled={!currentCategoryId}
                className="rounded-md bg-primary/70 px-4 py-2 font-extrabold text-white hover:bg-primary disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Agregar
              </button>
            </div>
            {selectedCategoryIds.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedCategoryIds.map((catId) => {
                  const category = categories?.find((c) => c.id === catId);
                  return (
                    <div
                      key={catId}
                      className="flex items-center gap-2 rounded-full bg-fourth px-3 py-1 text-sm font-extrabold text-white"
                    >
                      <span>{category?.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategoryIds(
                            selectedCategoryIds.filter((id) => id !== catId),
                          );
                        }}
                        className="hover:text-black"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-extrabold text-primary">
              Subcategorías (mín. 1)
            </label>
            <div className="flex gap-2">
              <select
                className="flex-1 rounded-md border border-primary p-2 text-primary"
                value={currentSubcategoryId}
                onChange={(e) => setCurrentSubcategoryId(e.target.value)}
                disabled={availableSubcategories.length === 0}
              >
                <option value="">Seleccionar subcategoría...</option>
                {availableSubcategories
                  .filter((s) => !selectedSubcategoryIds.includes(s.id))
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  if (
                    currentSubcategoryId &&
                    !selectedSubcategoryIds.includes(currentSubcategoryId)
                  ) {
                    setSelectedSubcategoryIds([
                      ...selectedSubcategoryIds,
                      currentSubcategoryId,
                    ]);
                    setCurrentSubcategoryId("");
                  }
                }}
                disabled={!currentSubcategoryId}
                className="rounded-md bg-primary/70 px-4 py-2 font-extrabold text-white hover:bg-primary disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Agregar
              </button>
            </div>
            {selectedSubcategoryIds.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedSubcategoryIds.map((subId) => {
                  const subcategory = availableSubcategories.find(
                    (s) => s.id === subId,
                  );
                  return (
                    <div
                      key={subId}
                      className="flex items-center gap-2 rounded-full bg-fourth px-3 py-1 text-sm font-extrabold text-white"
                    >
                      <span>{subcategory?.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubcategoryIds(
                            selectedSubcategoryIds.filter((id) => id !== subId),
                          );
                        }}
                        className="font-bold text-white hover:text-black"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-extrabold text-primary">
              Avatar del establecimiento
            </label>
            {isEditMode && form.avatar && !avatarFile && (
              <div className="mb-2">
                <img
                  src={generateImageUrl("establishment-logo", form.avatar)}
                  alt="Avatar actual"
                  className="h-24 w-24 rounded object-cover"
                />
                <p className="mt-1 text-xs text-gray-500">Avatar actual</p>
              </div>
            )}
            <ImageUpload
              onChange={(files) => setAvatarFile(files?.[0] ?? null)}
              accept="image/*"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-extrabold text-primary">
              Galería {isEditMode ? "" : "(mín. 5 imágenes)"}
            </label>
            {isEditMode && existingImages.length > 0 && (
              <div className="mb-2">
                <p className="mb-2 text-xs text-gray-500">Imágenes actuales:</p>
                <div className="flex flex-wrap gap-2">
                  {existingImages.map((img) => (
                    <div
                      key={img.id}
                      className="relative"
                      onClick={() => handleDeleteImage(img.id)}
                    >
                      <img
                        src={generateImageUrl("establishment", img.fileName)}
                        alt="Imagen de galería"
                        className="h-20 w-20 rounded object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-blue-600">
                  Para agregar más imágenes, selecciona nuevos archivos abajo
                </p>
              </div>
            )}
            <ImageUpload
              multiple
              onChange={(files) => setGalleryFiles(files)}
              accept="image/*"
              maxFiles={10}
            />
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Para completar el perfil: avatar + al menos 5 imágenes, 1 categoría y
          1 subcategoría.
        </div>

        <div className="flex w-full items-center justify-between gap-3">
          <Button
            label="Cancelar"
            type="button"
            onClick={() => navigate(from)}
          />
          <Button
            label={
              isLoading
                ? isEditMode
                  ? "Actualizando..."
                  : "Creando..."
                : isEditMode
                  ? "Actualizar establecimiento"
                  : "Crear establecimiento"
            }
            disabled={!canSubmit || isLoading}
            onClick={isEditMode ? handleUpdate : handleCreate}
          />
        </div>
      </div>
    </SectionContainer>
  );
}
