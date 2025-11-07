import { sponsorService } from "@/api/sponsor-service";
import Button from "@/component/ui/Button";
import ImageUpload from "@/component/ui/ImageUpload";
import Input from "@/component/ui/Input";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function CreateSponsorPage() {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const createSponsor = useMutation({
    mutationFn: (name: string) =>
      sponsorService.createSponsor({ name }).then((res) => res?.data),
  });
  const uploadSponsorImage = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      sponsorService.uploadSponsorImage(id, formData).then((res) => res?.data),
  });
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createSponsor.mutateAsync(name, {
      onSuccess: async ({ data }) => {
        console.log("SUCEESS ", data);
        if (data && imageFile) {
          const formData = new FormData();
          formData.append("file", imageFile);
          await uploadSponsorImage.mutateAsync({ id: data.id, formData });
        }
        resetForm();
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };
  const resetForm = () => {
    setName("");
    setImageFile(null);
  };
  return (
    <form onSubmit={onSubmit}>
      <h1>Crear patrocinador</h1>
      {/* Image Upload */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-2xl font-bold text-gray-500">
            Imagen principal
          </label>
        </div>
        <div>
          {imageFile && (
            <div className="mb-2">
              <img
                src={URL.createObjectURL(imageFile)}
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

      <Input
        id="create-sponsor-name"
        type="text"
        title="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button type="submit" label="Crear" />
    </form>
  );
}
