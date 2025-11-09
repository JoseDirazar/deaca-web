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
import { useLocation, useNavigate, type NavigateFunction } from "react-router";
import type { Image } from "@/types/common/image.interface";
import PageHeader from "../PageHeader";
import type { Category } from "@/types/category/category.interface";
import Modal from "../ui/Modal";

interface UserEstablishmentFormProps {
  establishment?: Establishment | null;
}

export default function UserEstablishmentForm({
  establishment,
}: UserEstablishmentFormProps) {
  const isEditMode = Boolean(establishment);
  const from = useLocation().state?.from ?? "/usuario/emprendimientos";
  const navigate = useNavigate();

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
    acceptCreditCard: false,
    acceptDebitCard: false,
    acceptMercadoPago: false,
    acceptCtaDNI: false,
    cashDiscount: 0,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<Image[]>([]);

  const [modal, setModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const {
    createEstablishment,
    updateEstablishment,
    updateEstablishmentAvatar,
    updateEstablishmentImages,
    deleteEstablishmentImage,
  } = useEstablishmentApi();
  const { useGetCategories } = useCategoryApi();
  const { data, isPending: isLoadingCategories } = useGetCategories({});

  const isLoading =
    createEstablishment.isPending ||
    updateEstablishmentAvatar.isPending ||
    updateEstablishmentImages.isPending ||
    isLoadingCategories;

  useEffect(() => {
    const subs = data?.data
      ?.filter((c) => selectedCategoryIds.includes(c.id))
      .flatMap((c) => c.subcategories || []);
    setAvailableSubcategories(subs || []);
    setSelectedSubcategoryIds((prev) =>
      prev.filter((id) => subs?.some((s) => s.id === id)),
    );
  }, [selectedCategoryIds, data?.data]);

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
        acceptCreditCard: establishment.acceptCreditCard || false,
        acceptDebitCard: establishment.acceptDebitCard || false,
        acceptMercadoPago: establishment.acceptMercadoPago || false,
        acceptCtaDNI: establishment.acceptCtaDNI || false,
        cashDiscount: establishment.cashDiscount || 0,
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
      acceptCreditCard: false,
      acceptDebitCard: false,
      acceptMercadoPago: false,
      acceptCtaDNI: false,
      cashDiscount: 0,
    });
    setSelectedCategoryIds([]);
    setSelectedSubcategoryIds([]);
    setAvatarFile(null);
    setGalleryFiles(null);
  };

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
      acceptCreditCard: form.acceptCreditCard,
      acceptDebitCard: form.acceptDebitCard,
      acceptMercadoPago: form.acceptMercadoPago,
      acceptCtaDNI: form.acceptCtaDNI,
      cashDiscount: form.cashDiscount,
    };

    createEstablishment.mutate(payload, {
      onSuccess: async ({ data }) => {
        // Upload avatar if provided
        if (data && avatarFile) {
          const formData = new FormData();
          formData.append("file", avatarFile);
          await updateEstablishmentAvatar.mutateAsync({
            id: data.id,
            formData,
          });
        }
        // Upload gallery images if provided
        if (data && galleryFiles && galleryFiles.length > 0) {
          const formData = new FormData();
          for (const f of Array.from(galleryFiles)) {
            formData.append("files", f);
          }
          await updateEstablishmentImages.mutateAsync({
            id: data.id,
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
      acceptCreditCard: form.acceptCreditCard,
      acceptDebitCard: form.acceptDebitCard,
      acceptMercadoPago: form.acceptMercadoPago,
      acceptCtaDNI: form.acceptCtaDNI,
      cashDiscount: form.cashDiscount,
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

  const handleDeleteImage = (imageId?: string) => {
    if (!establishment || !imageId) return;
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    deleteEstablishmentImage.mutate({ id: establishment.id, imageId });
  };

  return (
    <div className="space-y-4 rounded-lg">
      <PageHeader
        className="mb-8"
        title={
          isEditMode ? "Editar emprendimiento" : "Registra tu emprendimiento"
        }
        description={
          isEditMode
            ? `Edita los datos de ${establishment?.name ?? ""}.`
            : "Ingresa los datos de tu emprendimiento/local." +
              (isEditMode
                ? " Tener en cuenta que los cambios aplicados deberan ser aprobados por un administrador"
                : " Tener encuenta que el emprendimiento/local sera visible luego de que sea aprobado por un administrador")
        }
      />
      <UploadEstablishmentFilesForm
        form={form}
        isEditMode={isEditMode}
        existingImages={existingImages}
        avatarFile={avatarFile}
        setAvatarFile={setAvatarFile}
        setGalleryFiles={setGalleryFiles}
        setModal={setModal}
        setSelectedImage={setSelectedImage}
      />
      <NameAndDescriptionForm form={form} setForm={setForm} />

      <LocationForm form={form} setForm={setForm} />
      <CategoryForm
        currentCategoryId={currentCategoryId}
        setCurrentCategoryId={setCurrentCategoryId}
        selectedCategoryIds={selectedCategoryIds}
        data={data?.data ?? []}
        setSelectedCategoryIds={setSelectedCategoryIds}
        currentSubcategoryId={currentSubcategoryId}
        setCurrentSubcategoryId={setCurrentSubcategoryId}
        selectedSubcategoryIds={selectedSubcategoryIds}
        setSelectedSubcategoryIds={setSelectedSubcategoryIds}
        availableSubcategories={availableSubcategories}
      />

      <ContactForm form={form} setForm={setForm} />
      
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-500 mb-4">Métodos de pago</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="acceptCreditCard"
                type="checkbox"
                checked={form.acceptCreditCard || false}
                onChange={(e) =>
                  setForm({ ...form, acceptCreditCard: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="acceptCreditCard" className="ml-2 text-sm text-gray-700">
                Acepta Tarjeta de Crédito
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="acceptDebitCard"
                type="checkbox"
                checked={form.acceptDebitCard || false}
                onChange={(e) =>
                  setForm({ ...form, acceptDebitCard: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="acceptDebitCard" className="ml-2 text-sm text-gray-700">
                Acepta Tarjeta de Débito
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="acceptMercadoPago"
                type="checkbox"
                checked={form.acceptMercadoPago || false}
                onChange={(e) =>
                  setForm({ ...form, acceptMercadoPago: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="acceptMercadoPago" className="ml-2 text-sm text-gray-700">
                Acepta Mercado Pago
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="acceptCtaDNI"
                type="checkbox"
                checked={form.acceptCtaDNI || false}
                onChange={(e) =>
                  setForm({ ...form, acceptCtaDNI: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="acceptCtaDNI" className="ml-2 text-sm text-gray-700">
                Acepta Cuenta DNI
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="cashDiscount" className="block text-sm font-medium text-gray-700 mb-1">
              Descuento por pago en efectivo (%)
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="cashDiscount"
                min="0"
                max="100"
                value={form.cashDiscount || 0}
                onChange={(e) =>
                  setForm({ ...form, cashDiscount: parseFloat(e.target.value) || 0 })
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="0"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Ingrese el porcentaje de descuento por pago en efectivo (opcional)
            </p>
          </div>
        </div>
      </div>

      <SubmitFormSection
        isLoading={isLoading}
        isEditMode={isEditMode}
        canSubmit={canSubmit}
        handleCreate={handleCreate}
        handleUpdate={handleUpdate}
        from={from}
        navigate={navigate}
      />

      <Modal setIsOpen={setModal} isOpen={modal}>
        <div className="flex flex-col gap-4">
          <p className="text-center text-4xl text-gray-500">
            Estas seguro que quieres eliminar la imagen?
          </p>
          <img
            src={generateImageUrl("establishment", selectedImage?.fileName)}
            alt=""
            className="m-auto"
          />
          <Button
            className="w-full"
            label="Eliminar"
            onClick={() => handleDeleteImage(selectedImage?.id)}
            disabled={!selectedImage || deleteEstablishmentImage.isPending}
          />
        </div>
      </Modal>
    </div>
  );
}

function SubmitFormSection({
  isLoading,
  isEditMode,
  canSubmit,
  handleCreate,
  handleUpdate,
  from,
  navigate,
}: {
  isLoading: boolean;
  isEditMode: boolean;
  canSubmit: boolean;
  handleCreate: () => void;
  handleUpdate: () => void;
  from: string;
  navigate: NavigateFunction;
}) {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <Button label="Cancelar" type="button" onClick={() => navigate(from)} />
      <Button
        label={
          isLoading
            ? isEditMode
              ? "Actualizando..."
              : "Registrando..."
            : isEditMode
              ? "Actualizar datos"
              : "Registrar emprendimiento"
        }
        disabled={!canSubmit || isLoading}
        onClick={isEditMode ? handleUpdate : handleCreate}
      />
    </div>
  );
}

function UploadEstablishmentFilesForm({
  form,
  isEditMode,
  existingImages,
  avatarFile,
  setAvatarFile,
  setGalleryFiles,
  setSelectedImage,
  setModal,
}: {
  form: Partial<Establishment>;
  isEditMode: boolean;
  existingImages: Image[];
  avatarFile: File | null;
  setAvatarFile: (file: File | null) => void;
  setGalleryFiles: React.Dispatch<React.SetStateAction<FileList | null>>;
  setSelectedImage: React.Dispatch<React.SetStateAction<Image | null>>;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-2xl font-bold text-gray-500">
          Logo y galeria de imágenes
        </label>
        <p className="text-sm text-gray-500">
          Ingresar un logo y al menos 6 imagenes
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-extrabold text-primary">
            Logo
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
            Galería {isEditMode ? "" : "(mín. 6 imágenes)"}
          </label>
          {isEditMode && existingImages.length > 0 && (
            <div className="mb-2">
              <p className="mb-2 text-xs text-gray-500">Imágenes actuales:</p>
              <div className="flex flex-wrap gap-2">
                {existingImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative"
                    onClick={() => {
                      setSelectedImage(img);
                      setModal(true);
                    }}
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
    </div>
  );
}

function NameAndDescriptionForm({
  form,
  setForm,
}: {
  form: Partial<Establishment>;
  setForm: React.Dispatch<React.SetStateAction<Partial<Establishment>>>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <label className="text-2xl font-bold text-gray-500">
        Nombre y descripción.
      </label>
      <Input
        id="name"
        type="text"
        title="Nombre"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <textarea
        id="description"
        placeholder="Ingresa una descripción de tu emprendimiento e indica que productos
            o servicios ofrece"
        about="asdf"
        rows={4}
        className="w-full rounded-lg border border-primary p-3 font-century-gothic font-bold text-fourth placeholder:text-primary focus:border-2 focus:border-primary focus:ring-primary focus:outline-none"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
    </div>
  );
}

function LocationForm({
  form,
  setForm,
}: {
  form: Partial<Establishment>;
  setForm: React.Dispatch<React.SetStateAction<Partial<Establishment>>>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-2xl font-bold text-gray-500">
          Ingresa los datos de la ubicación.
        </label>
        <p className="text-sm text-gray-500">
          Estos datos pueden extraerse de{" "}
          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Google Maps
          </a>
          : seleccionar la ubicación en el mapa y copiar la latitud y longitud
        </p>
      </div>
      <div className="flex gap-2">
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
    </div>
  );
}

function CategoryForm({
  currentCategoryId,
  setCurrentCategoryId,
  selectedCategoryIds,
  data,
  setSelectedCategoryIds,
  currentSubcategoryId,
  setCurrentSubcategoryId,
  selectedSubcategoryIds,
  setSelectedSubcategoryIds,
  availableSubcategories,
}: {
  currentCategoryId: string;
  setCurrentCategoryId: React.Dispatch<React.SetStateAction<string>>;
  selectedCategoryIds: string[];
  data: Category[];
  setSelectedCategoryIds: React.Dispatch<React.SetStateAction<string[]>>;
  currentSubcategoryId: string;
  setCurrentSubcategoryId: React.Dispatch<React.SetStateAction<string>>;
  selectedSubcategoryIds: string[];
  setSelectedSubcategoryIds: React.Dispatch<React.SetStateAction<string[]>>;
  availableSubcategories: Subcategory[];
}) {
  return (
    <div>
      <label className="text-2xl font-bold text-gray-500">
        Categorías y subcategorías.
      </label>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="">
          <label className="mb-1 block text-sm font-extrabold text-primary">
            Categorías (mín. 1)
          </label>
          <p className="text-sm text-gray-400">
            Selecciona las categorías que se relacionan con tu emprendimiento.
          </p>
          <div className="flex gap-2">
            <select
              className="flex-1 rounded-md border border-primary p-2 text-primary"
              value={currentCategoryId}
              onChange={(e) => {
                const categoryId = e.target.value;
                setCurrentCategoryId(categoryId);
                if (categoryId && !selectedCategoryIds.includes(categoryId)) {
                  setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
                  setCurrentCategoryId("");
                }
              }}
            >
              <option value="">Seleccionar categoría...</option>
              {data
                ?.filter((c) => !selectedCategoryIds.includes(c.id))
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
          {selectedCategoryIds.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedCategoryIds.map((catId) => {
                const category = data?.find((c) => c.id === catId);
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
        <div className="">
          <label className="mb-1 block text-sm font-extrabold text-primary">
            Subcategorías (mín. 1)
          </label>
          <p className="text-sm text-gray-400">
            Selecciona las subcategorías que se relacionan con tu
            emprendimiento.
          </p>
          <div className="flex gap-2">
            <select
              className="flex-1 rounded-md border border-primary p-2 text-primary"
              value={currentSubcategoryId}
              onChange={(e) => {
                const subcategoryId = e.target.value;
                setCurrentSubcategoryId(subcategoryId);
                if (subcategoryId && !selectedSubcategoryIds.includes(subcategoryId)) {
                  setSelectedSubcategoryIds([...selectedSubcategoryIds, subcategoryId]);
                  setCurrentSubcategoryId("");
                }
              }}
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
    </div>
  );
}

function ContactForm({
  form,
  setForm,
}: {
  form: Partial<Establishment>;
  setForm: React.Dispatch<React.SetStateAction<Partial<Establishment>>>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <label className="text-2xl font-bold text-gray-500">
        Datos de contacto.
      </label>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          id="address"
          type="text"
          title="Dirección"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </div>
    </div>
  );
}
