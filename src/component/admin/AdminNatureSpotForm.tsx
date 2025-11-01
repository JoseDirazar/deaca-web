import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import type { NatureSpot } from "@/types/nature-spot/nature-spot.interface";
import type { NatureSpotDto } from "@/types/common/api-request.interface";
import { useNatureSpotApi } from "@/hooks/useNatureSpotApi.hook";
import PageHeader from "@/component/PageHeader";
import Input from "@/component/ui/Input";
import Button from "@/component/ui/Button";
import { generateImageUrl } from "@/lib/generate-image-url";
import ImageUpload from "@/component/ui/ImageUpload";
import type { Image } from "@/types/common/image.interface";
import Modal from "@/component/ui/Modal";

interface AdminNatureSpotFormProps {
  natureSpot?: NatureSpot | null;
}

export default function AdminNatureSpotForm({
  natureSpot,
}: AdminNatureSpotFormProps) {
  const isEditMode = Boolean(natureSpot);
  const from = useLocation().state?.from ?? "/admin/paseos-naturales";
  const navigate = useNavigate();

  const [form, setForm] = useState<Partial<NatureSpotDto>>({
    name: "",
    description: "",
    latitude: 0,
    longitude: 0,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<Image[]>([]);
  const [modal, setModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const {
    useCreateNatureSpot,
    useUpdateNatureSpot,
    useUploadNatureSpotImage,
    useUploadNatureSpotImages,
    useDeleteNatureSpotImage,
  } = useNatureSpotApi();
  const createNatureSpot = useCreateNatureSpot;
  const updateNatureSpot = useUpdateNatureSpot;
  const uploadNatureSpotImage = useUploadNatureSpotImage;
  const uploadNatureSpotImages = useUploadNatureSpotImages;
  const deleteNatureSpotImage = useDeleteNatureSpotImage;

  const isLoading =
    createNatureSpot.isPending ||
    updateNatureSpot.isPending ||
    uploadNatureSpotImage.isPending ||
    uploadNatureSpotImages.isPending ||
    deleteNatureSpotImage.isPending;

  useEffect(() => {
    if (natureSpot) {
      setForm({
        name: natureSpot.name,
        description: natureSpot.description,
        latitude: natureSpot.latitude,
        longitude: natureSpot.longitude,
      });
      if (natureSpot.gallery) {
        setExistingImages(natureSpot.gallery);
      }
    }
  }, [natureSpot, setForm, setExistingImages]);

  const canSubmit =
    Boolean(form.name) &&
    Boolean(form.description) &&
    Boolean(form.latitude) &&
    Boolean(form.longitude) &&
    (isEditMode
      ? Boolean(natureSpot?.image) || Boolean(imageFile)
      : Boolean(imageFile));

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      latitude: 0,
      longitude: 0,
    });
    setImageFile(null);
    setGalleryFiles(null);
  };

  async function handleCreate() {
    if (!canSubmit) return;

    const payload: NatureSpotDto = {
      name: form.name!,
      description: form.description!,
      latitude: form.latitude!,
      longitude: form.longitude!,
    };

    createNatureSpot.mutate(payload as NatureSpot, {
      onSuccess: async ({ data }) => {
        if (data && imageFile) {
          const formData = new FormData();
          formData.append("file", imageFile);
          await uploadNatureSpotImage.mutateAsync({
            id: data.id,
            file: formData,
          });
        }
        if (data && galleryFiles && galleryFiles.length > 0) {
          const formData = new FormData();
          for (const f of Array.from(galleryFiles)) {
            formData.append("files", f);
          }
          await uploadNatureSpotImages.mutateAsync({
            id: data.id,
            files: formData,
          });
        }
        resetForm();
        navigate(from);
      },
    });
  }

  async function handleUpdate() {
    if (!natureSpot || !canSubmit) return;

    const payload: NatureSpotDto = {
      name: form.name!,
      description: form.description!,
      latitude: form.latitude!,
      longitude: form.longitude!,
    };

    updateNatureSpot.mutate(
      { id: natureSpot.id, natureSpot: payload as NatureSpot },
      {
        onSuccess: async () => {
          if (imageFile) {
            const formData = new FormData();
            formData.append("file", imageFile);
            await uploadNatureSpotImage.mutateAsync({
              id: natureSpot.id,
              file: formData,
            });
          }
          if (galleryFiles && galleryFiles.length > 0) {
            const formData = new FormData();
            for (const f of Array.from(galleryFiles)) {
              formData.append("files", f);
            }
            await uploadNatureSpotImages.mutateAsync({
              id: natureSpot.id,
              files: formData,
            });
          }
          navigate(from);
        },
      },
    );
  }

  const handleDeleteImage = (imageId?: string) => {
    if (!natureSpot || !imageId) return;
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    deleteNatureSpotImage.mutate({ id: natureSpot.id, imageId }, {
      onSuccess: () => {
        setModal(false);
        setSelectedImage(null);
      },
      onError: () => {
        // Restore image if deletion failed
        if (natureSpot?.gallery) {
          setExistingImages(natureSpot.gallery);
        }
      },
    });
  };

  return (
    <div className="space-y-4 rounded-lg">
      <PageHeader
        className="mb-8"
        title={isEditMode ? "Editar paseo natural" : "Crear paseo natural"}
        description={
          isEditMode
            ? `Edita los datos del paseo natural ${natureSpot?.name ?? ""}.`
            : "Ingresa los datos del nuevo paseo natural."
        }
      />

      {/* Image Upload */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-2xl font-bold text-gray-500">
            Imagen principal
          </label>
        </div>
        <div>
          {isEditMode && natureSpot?.image && !imageFile && (
            <div className="mb-2">
              <img
                src={generateImageUrl("nature-spot-logo", natureSpot.image)}
                alt="Imagen actual"
                className="h-24 w-24 rounded object-cover"
              />
              <p className="mt-1 text-xs text-gray-500">Imagen actual</p>
            </div>
          )}
          <ImageUpload
            onChange={(files) => setImageFile(files?.[0] ?? null)}
            accept="image/*"
          />
        </div>
      </div>

      {/* Gallery Upload */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-2xl font-bold text-gray-500">
            Galería de imágenes
          </label>
        </div>
        <div>
          {isEditMode && existingImages.length > 0 && (
            <div className="mb-2">
              <p className="mb-2 text-xs text-gray-500">Imágenes actuales:</p>
              <div className="flex flex-wrap gap-2">
                {existingImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative cursor-pointer"
                    onClick={() => {
                      setSelectedImage(img);
                      setModal(true);
                    }}
                  >
                    <img
                      src={generateImageUrl("nature-spot-image", img.fileName)}
                      alt="Imagen de galería"
                      className="h-20 w-20 rounded object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-blue-600">
                Haz clic en una imagen para eliminarla
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

      {/* Name and Description */}
      <div className="flex flex-col gap-4">
        <label className="text-2xl font-bold text-gray-500">
          Nombre y descripción
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
          placeholder="Ingresa una descripción del paseo natural"
          rows={4}
          className="w-full rounded-lg border border-primary p-3 font-century-gothic font-bold text-fourth placeholder:text-primary focus:border-2 focus:border-primary focus:ring-primary focus:outline-none"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      {/* Location */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-2xl font-bold text-gray-500">Ubicación</label>
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            id="latitude"
            type="number"
            title="Latitud"
            value={form.latitude}
            onChange={(e) =>
              setForm({ ...form, latitude: parseFloat(e.target.value) })
            }
          />
          <Input
            id="longitude"
            type="number"
            title="Longitud"
            value={form.longitude}
            onChange={(e) =>
              setForm({ ...form, longitude: parseFloat(e.target.value) })
            }
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex w-full items-center justify-between gap-3">
        <Button label="Cancelar" type="button" onClick={() => navigate(from)} />
        <Button
          label={
            isLoading
              ? isEditMode
                ? "Actualizando..."
                : "Creando..."
              : isEditMode
                ? "Actualizar paseo natural"
                : "Crear paseo natural"
          }
          disabled={!canSubmit || isLoading}
          onClick={isEditMode ? handleUpdate : handleCreate}
        />
      </div>

      <Modal setIsOpen={setModal} isOpen={modal}>
        <div className="flex flex-col gap-4">
          <p className="text-center text-4xl text-gray-500">
            ¿Estás seguro que quieres eliminar la imagen?
          </p>
          <img
            src={generateImageUrl("nature-spot-image", selectedImage?.fileName)}
            alt=""
            className="m-auto"
          />
          <Button
            className="w-full"
            label="Eliminar"
            onClick={() => handleDeleteImage(selectedImage?.id)}
            disabled={!selectedImage || deleteNatureSpotImage.isPending}
          />
        </div>
      </Modal>
    </div>
  );
}
