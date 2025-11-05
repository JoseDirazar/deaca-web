import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import type { Event } from "@/types/event/event.interface";
import type { EventDto } from "@/types/common/api-request.interface";
import PageHeader from "@/component/PageHeader";
import Input from "@/component/ui/Input";
import Button from "@/component/ui/Button";
import { generateImageUrl } from "@/lib/generate-image-url";
import ImageUpload from "@/component/ui/ImageUpload";
import type { Image } from "@/types/common/image.interface";
import { useEventApi } from "@/hooks/useEventApi.hook";
import Modal from "@/component/ui/Modal";

interface AdminEventFormProps {
  event?: Event | null;
}

export default function AdminEventForm({ event }: AdminEventFormProps) {
  const isEditMode = Boolean(event);
  const from = useLocation().state?.from ?? "/admin/eventos";
  const navigate = useNavigate();

  const [form, setForm] = useState<Partial<EventDto>>({
    name: "",
    description: "",
    start: new Date(),
    end: new Date(),
    time: new Date(),
    latitude: "",
    longitude: "",
    price: 0,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<Image[]>([]);
  const [modal, setModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const {
    useCreateEvent,
    useUpdateEvent,
    useUploadEventImage,
    useUploadEventImages,
    useDeleteEventImage,
  } = useEventApi();
  const createEvent = useCreateEvent;
  const updateEvent = useUpdateEvent;
  const uploadEventImage = useUploadEventImage;
  const uploadEventImages = useUploadEventImages;
  const deleteEventImage = useDeleteEventImage;

  const isLoading =
    createEvent.isPending ||
    updateEvent.isPending ||
    uploadEventImage.isPending ||
    uploadEventImages.isPending ||
    deleteEventImage.isPending;

  useEffect(() => {
    if (event) {
      setForm({
        name: event.name,
        description: event.description,
        start: new Date(event.start),
        end: new Date(event.end),
        time: new Date(event.time),
        latitude: event.latitude,
        longitude: event.longitude,
        price: event.price ?? 0,
      });
      if (event.gallery) {
        setExistingImages(event.gallery);
      }
    }
  }, [event]);

  const canSubmit =
    Boolean(form.name) &&
    Boolean(form.description) &&
    Boolean(form.start) &&
    Boolean(form.end) &&
    Boolean(form.time) &&
    (isEditMode
      ? Boolean(event?.image) || Boolean(imageFile)
      : Boolean(imageFile));

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      start: new Date(),
      end: new Date(),
      time: new Date(),
      latitude: "",
      longitude: "",
      price: 0,
    });
    setImageFile(null);
    setGalleryFiles(null);
  };

  async function handleCreate() {
    if (!canSubmit) return;

    const payload: EventDto = {
      name: form.name!,
      description: form.description!,
      start: form.start!,
      end: form.end!,
      time: form.time!,
      latitude: form.latitude!,
      longitude: form.longitude!,
      price: form.price!,
    };

    createEvent.mutate(payload, {
      onSuccess: async ({ data }) => {
        if (data && imageFile) {
          const formData = new FormData();
          formData.append("file", imageFile);
          await uploadEventImage.mutateAsync({ id: data.id, file: formData });
        }
        if (data && galleryFiles && galleryFiles.length > 0) {
          const formData = new FormData();
          for (const f of Array.from(galleryFiles)) {
            formData.append("files", f);
          }
          await uploadEventImages.mutateAsync({ id: data.id, files: formData });
        }
        resetForm();
        navigate(from);
      },
    });
  }

  async function handleUpdate() {
    if (!event || !canSubmit) return;

    const payload: EventDto = {
      name: form.name!,
      description: form.description!,
      start: form.start!,
      end: form.end!,
      time: form.time!,
      latitude: form.latitude!,
      longitude: form.longitude!,
      price: form.price!,
    };

    updateEvent.mutate(
      { id: event.id, event: payload },
      {
        onSuccess: async () => {
          if (imageFile) {
            const formData = new FormData();
            formData.append("file", imageFile);
            await uploadEventImage.mutateAsync({
              id: event.id,
              file: formData,
            });
          }
          if (galleryFiles && galleryFiles.length > 0) {
            const formData = new FormData();
            for (const f of Array.from(galleryFiles)) {
              formData.append("files", f);
            }
            await uploadEventImages.mutateAsync({
              id: event.id,
              files: formData,
            });
          }
          navigate(from);
        },
      },
    );
  }

  const handleDeleteImage = (imageId?: string) => {
    if (!event || !imageId) return;
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    deleteEventImage.mutate(
      { id: event.id, imageId },
      {
        onSuccess: () => {
          setModal(false);
          setSelectedImage(null);
        },
        onError: () => {
          // Restore image if deletion failed
          if (event?.gallery) {
            setExistingImages(event.gallery);
          }
        },
      },
    );
  };

  return (
    <div className="space-y-4 rounded-lg">
      <PageHeader
        className="mb-8"
        title={isEditMode ? "Editar evento" : "Crear evento"}
        description={
          isEditMode
            ? `Edita los datos del evento ${event?.name ?? ""}.`
            : "Ingresa los datos del nuevo evento."
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
          {isEditMode && event?.image && !imageFile && (
            <div className="mb-2">
              <img
                src={generateImageUrl("event-logo", event.image)}
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
                      src={generateImageUrl("event-image", img.fileName)}
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
          placeholder="Ingresa una descripción del evento"
          rows={4}
          className="w-full rounded-lg border border-primary p-3 font-century-gothic font-bold text-fourth placeholder:text-primary focus:border-2 focus:border-primary focus:ring-primary focus:outline-none"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      {/* Date and Time */}
      <div className="flex flex-col gap-4">
        <label className="text-2xl font-bold text-gray-500">
          Fechas y hora
        </label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            id="start"
            type="datetime-local"
            title="Fecha de inicio"
            value={
              form.start ? new Date(form.start).toISOString().slice(0, 16) : ""
            }
            onChange={(e) =>
              setForm({ ...form, start: new Date(e.target.value) })
            }
          />
          <Input
            id="end"
            type="datetime-local"
            title="Fecha de fin"
            value={
              form.end ? new Date(form.end).toISOString().slice(0, 16) : ""
            }
            onChange={(e) =>
              setForm({ ...form, end: new Date(e.target.value) })
            }
          />
          <Input
            id="time"
            type="datetime-local"
            title="Hora del evento"
            value={
              form.time ? new Date(form.time).toISOString().slice(0, 16) : ""
            }
            onChange={(e) =>
              setForm({ ...form, time: new Date(e.target.value) })
            }
          />
        </div>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-4">
        <label className="text-2xl font-bold text-gray-500">Ubicación</label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

      {/* Price */}
      <div className="flex flex-col gap-4">
        <Input
          id="price"
          type="number"
          title="Precio"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: parseFloat(e.target.value) })
          }
        />
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
                ? "Actualizar evento"
                : "Crear evento"
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
            src={generateImageUrl("event-image", selectedImage?.fileName)}
            alt=""
            className="m-auto"
          />
          <Button
            className="w-full"
            label="Eliminar"
            onClick={() => handleDeleteImage(selectedImage?.id)}
            disabled={!selectedImage || deleteEventImage.isPending}
          />
        </div>
      </Modal>
    </div>
  );
}
