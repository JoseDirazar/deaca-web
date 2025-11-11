import { useEffect, useState } from "react";
import {
  useForm,
  FormProvider,
  Controller,
  useFormContext,
  type Resolver,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

const formSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  address: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  email: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || /.+@.+\..+/.test(v), "Email inválido"),
  website: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => !v || /^(https?:\/\/)?[^\s]+\.[^\s]+/.test(v),
      "URL inválida",
    ),
  description: z.string().optional().or(z.literal("")),
  avatar: z.string().optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  facebook: z.string().optional().or(z.literal("")),
  latitude: z.string().optional().or(z.literal("")),
  longitude: z.string().optional().or(z.literal("")),
  acceptCreditCard: z.boolean(),
  acceptDebitCard: z.boolean(),
  acceptMercadoPago: z.boolean(),
  acceptCtaDNI: z.boolean(),
  cashDiscount: z.number().min(0).max(100),
  categoryIds: z.array(z.string()).min(1, "Selecciona al menos 1 categoría"),
  subcategoryIds: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

export default function UserEstablishmentForm({
  establishment,
}: UserEstablishmentFormProps) {
  const isEditMode = Boolean(establishment);
  const from = useLocation().state?.from ?? "/usuario/emprendimientos";
  const navigate = useNavigate();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    mode: "onChange",
    defaultValues: {
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
      cashDiscount: 10,
      categoryIds: [],
      subcategoryIds: [],
    },
  });
  const { watch, setValue, reset, handleSubmit } = methods;

  const selectedCategoryIds = watch("categoryIds") as string[];
  const selectedSubcategoryIds = watch("subcategoryIds") as string[];

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<Image[]>([]);
  const [availableSubcategories, setAvailableSubcategories] = useState<
    Subcategory[]
  >([]);

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
    const filtered = selectedSubcategoryIds.filter((id) =>
      (subs || []).some((s) => s.id === id),
    );
    if (filtered.length !== selectedSubcategoryIds.length) {
      setValue("subcategoryIds", filtered, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [selectedCategoryIds, selectedSubcategoryIds, data?.data, setValue]);

  useEffect(() => {
    if (establishment) {
      reset({
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
        categoryIds:
          establishment.categories
            ?.map((c) => c.id)
            .filter((id): id is string => Boolean(id)) || [],
        subcategoryIds:
          establishment.subcategories
            ?.map((s) => s.id)
            .filter((id): id is string => Boolean(id)) || [],
      });
      setExistingImages(establishment.images || []);
    }
  }, [establishment, reset]);

  const resetForm = () => {
    reset({
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
      categoryIds: [],
      subcategoryIds: [],
    });
    setAvatarFile(null);
    setGalleryFiles(null);
  };

  function onCreate(values: FormValues) {
    if (!canSubmit()) return;

    const payload: CreateEstablishmentDto = {
      name: values.name,
      categories: values.categoryIds.map((id) => ({ id })),
      subcategories: values.subcategoryIds.map((id) => ({ id })),
      address: values.address,
      phone: values.phone,
      email: values.email,
      website: values.website,
      description: values.description,
      instagram: values.instagram,
      facebook: values.facebook,
      latitude: values.latitude,
      longitude: values.longitude,
      acceptCreditCard: values.acceptCreditCard,
      acceptDebitCard: values.acceptDebitCard,
      acceptMercadoPago: values.acceptMercadoPago,
      acceptCtaDNI: values.acceptCtaDNI,
      cashDiscount: values.cashDiscount,
    };

    createEstablishment.mutateAsync(payload, {
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

  async function onUpdate(values: FormValues) {
    if (!establishment || !canSubmit()) return;

    const payload = {
      id: establishment.id,
      createdAt: establishment.createdAt,
      updatedAt: establishment.updatedAt,
      name: values.name,
      categories: values.categoryIds.map((id) => ({ id })),
      subcategories: values.subcategoryIds.map((id) => ({ id })),
      address: values.address,
      phone: values.phone,
      email: values.email,
      website: values.website,
      description: values.description,
      instagram: values.instagram,
      facebook: values.facebook,
      latitude: values.latitude,
      longitude: values.longitude,
      acceptCreditCard: values.acceptCreditCard,
      acceptDebitCard: values.acceptDebitCard,
      acceptMercadoPago: values.acceptMercadoPago,
      acceptCtaDNI: values.acceptCtaDNI,
      cashDiscount: values.cashDiscount,
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

  const canSubmit = () => {
    const values = methods.getValues();
    const nameOk = (values.name?.trim() || "").length > 0;
    const hasCategory = (values.categoryIds?.length || 0) >= 1;
    return nameOk && hasCategory && !isLoading;
  };

  const handleDeleteImage = (imageId?: string) => {
    if (!establishment || !imageId) return;
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    deleteEstablishmentImage.mutate({ id: establishment.id, imageId });
  };

  return (
    <FormProvider {...methods}>
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
          isEditMode={isEditMode}
          existingImages={existingImages}
          avatarFile={avatarFile}
          setAvatarFile={setAvatarFile}
          setGalleryFiles={setGalleryFiles}
          setModal={setModal}
          setSelectedImage={setSelectedImage}
        />
        <NameAndDescriptionForm />

        <LocationForm />
        <CategoryForm
          data={data?.data ?? []}
          availableSubcategories={availableSubcategories}
        />

        <ContactForm />

        <div className="mt-8">
          <h3 className="mb-4 text-2xl font-bold text-gray-500">
            Métodos de pago
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center">
                <Controller
                  name="acceptCreditCard"
                  render={({ field }) => (
                    <input
                      id="acceptCreditCard"
                      type="checkbox"
                      checked={field.value || false}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  )}
                />
                <label
                  htmlFor="acceptCreditCard"
                  className="ml-2 text-sm text-gray-700"
                >
                  Acepta Tarjeta de Crédito
                </label>
              </div>

              <div className="flex items-center">
                <Controller
                  name="acceptDebitCard"
                  render={({ field }) => (
                    <input
                      id="acceptDebitCard"
                      type="checkbox"
                      checked={field.value || false}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  )}
                />
                <label
                  htmlFor="acceptDebitCard"
                  className="ml-2 text-sm text-gray-700"
                >
                  Acepta Tarjeta de Débito
                </label>
              </div>

              <div className="flex items-center">
                <Controller
                  name="acceptMercadoPago"
                  render={({ field }) => (
                    <input
                      id="acceptMercadoPago"
                      type="checkbox"
                      checked={field.value || false}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  )}
                />
                <label
                  htmlFor="acceptMercadoPago"
                  className="ml-2 text-sm text-gray-700"
                >
                  Acepta Mercado Pago
                </label>
              </div>

              <div className="flex items-center">
                <Controller
                  name="acceptCtaDNI"
                  render={({ field }) => (
                    <input
                      id="acceptCtaDNI"
                      type="checkbox"
                      checked={field.value || false}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  )}
                />
                <label
                  htmlFor="acceptCtaDNI"
                  className="ml-2 text-sm text-gray-700"
                >
                  Acepta Cuenta DNI
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="cashDiscount"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Descuento por pago en efectivo (%)
              </label>
              <div className="mt-1">
                <Controller
                  name="cashDiscount"
                  render={({ field }) => (
                    <input
                      type="number"
                      id="cashDiscount"
                      min={0}
                      max={100}
                      value={field.value || 0}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      placeholder="0"
                    />
                  )}
                />
              </div>
              {methods.formState.errors.cashDiscount?.message && (
                <p className="mt-1 text-xs text-red-600">
                  {methods.formState.errors.cashDiscount.message as string}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Ingrese el porcentaje de descuento por pago en efectivo
                (opcional)
              </p>
            </div>
          </div>
        </div>

        {(() => {
          const onSubmit: (values: FormValues) => void = isEditMode
            ? onUpdate
            : onCreate;
          return (
            <SubmitFormSection
              isLoading={isLoading}
              isEditMode={isEditMode}
              canSubmit={canSubmit}
              onSubmit={handleSubmit(onSubmit)}
              from={from}
              navigate={navigate}
            />
          );
        })()}

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
    </FormProvider>
  );
}

function SubmitFormSection({
  isLoading,
  isEditMode,
  canSubmit,
  onSubmit,
  from,
  navigate,
}: {
  isLoading: boolean;
  isEditMode: boolean;
  canSubmit: () => boolean;
  onSubmit: () => void;
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
        onClick={onSubmit}
        disabled={!canSubmit() || isLoading}
        loading={isLoading}
      />
    </div>
  );
}

function UploadEstablishmentFilesForm({
  isEditMode,
  existingImages,
  avatarFile,
  setAvatarFile,
  setGalleryFiles,
  setSelectedImage,
  setModal,
}: {
  isEditMode: boolean;
  existingImages: Image[];
  avatarFile: File | null;
  setAvatarFile: (file: File | null) => void;
  setGalleryFiles: React.Dispatch<React.SetStateAction<FileList | null>>;
  setSelectedImage: React.Dispatch<React.SetStateAction<Image | null>>;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { watch } = useFormContext<FormValues>();
  const avatar = watch("avatar");
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
          {isEditMode && avatar && !avatarFile && (
            <div className="mb-2">
              <img
                src={generateImageUrl("establishment-logo", avatar)}
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

function NameAndDescriptionForm() {
  const { control, formState } = useFormContext<FormValues>();
  const { errors } = formState;
  return (
    <div className="flex flex-col gap-4">
      <label className="text-2xl font-bold text-gray-500">
        Nombre y descripción.
      </label>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input
            id="name"
            type="text"
            title="Nombre"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
          />
        )}
      />
      {errors.name?.message && (
        <p className="-mt-3 text-xs text-red-600">
          {errors.name.message as string}
        </p>
      )}

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <textarea
            id="description"
            placeholder="Ingresa una descripción de tu emprendimiento e indica que productos
            o servicios ofrece"
            about="asdf"
            rows={4}
            className="w-full rounded-lg border border-primary p-3 font-century-gothic font-bold text-fourth placeholder:text-primary focus:border-2 focus:border-primary focus:ring-primary focus:outline-none"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
          />
        )}
      />
    </div>
  );
}

function LocationForm() {
  const { control } = useFormContext<FormValues>();
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
        <Controller
          name="latitude"
          control={control}
          render={({ field }) => (
            <Input
              id="latitude"
              type="text"
              title="Latitud"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        <Controller
          name="longitude"
          control={control}
          render={({ field }) => (
            <Input
              id="longitude"
              type="text"
              title="Longitud"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
      </div>
    </div>
  );
}

function CategoryForm({
  data,
  availableSubcategories,
}: {
  data: Category[];
  availableSubcategories: Subcategory[];
}) {
  const { watch, setValue, formState } = useFormContext<FormValues>();
  const { errors } = formState;
  const selectedCategoryIds = watch("categoryIds");
  const selectedSubcategoryIds = watch("subcategoryIds");
  const [currentCategoryId, setCurrentCategoryId] = useState<string>("");
  const [currentSubcategoryId, setCurrentSubcategoryId] = useState<string>("");
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
                  setValue(
                    "categoryIds",
                    [...selectedCategoryIds, categoryId],
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    },
                  );
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
              {selectedCategoryIds.map((catId: string) => {
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
                        setValue(
                          "categoryIds",
                          selectedCategoryIds.filter(
                            (id: string) => id !== catId,
                          ),
                          { shouldDirty: true, shouldValidate: true },
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
          {errors.categoryIds?.message && (
            <p className="mt-2 text-xs text-red-600">
              {errors.categoryIds.message as string}
            </p>
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
                if (
                  subcategoryId &&
                  !selectedSubcategoryIds.includes(subcategoryId)
                ) {
                  setValue(
                    "subcategoryIds",
                    [...selectedSubcategoryIds, subcategoryId],
                    { shouldDirty: true, shouldValidate: true },
                  );
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
              {selectedSubcategoryIds.map((subId: string) => {
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
                        setValue(
                          "subcategoryIds",
                          selectedSubcategoryIds.filter(
                            (id: string) => id !== subId,
                          ),
                          { shouldDirty: true, shouldValidate: true },
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

function ContactForm() {
  const { control, formState } = useFormContext<FormValues>();
  const { errors } = formState;
  return (
    <div className="flex flex-col gap-4">
      <label className="text-2xl font-bold text-gray-500">
        Datos de contacto.
      </label>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <Input
              id="phone"
              type="tel"
              title="Teléfono"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              id="email"
              type="email"
              title="Email"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        {errors.email?.message && (
          <p className="-mt-3 text-xs text-red-600">
            {errors.email.message as string}
          </p>
        )}
        <Controller
          name="website"
          control={control}
          render={({ field }) => (
            <Input
              id="website"
              type="url"
              title="Website"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        {errors.website?.message && (
          <p className="-mt-3 text-xs text-red-600">
            {errors.website.message as string}
          </p>
        )}
        <Controller
          name="instagram"
          control={control}
          render={({ field }) => (
            <Input
              id="instagram"
              type="text"
              title="Instagram"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        <Controller
          name="facebook"
          control={control}
          render={({ field }) => (
            <Input
              id="facebook"
              type="text"
              title="Facebook"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <Input
              id="address"
              type="text"
              title="Dirección"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
      </div>
    </div>
  );
}
