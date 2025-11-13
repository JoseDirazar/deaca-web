import PageHeader from "@/component/PageHeader";
import { Suspense, useEffect, useState } from "react";
import Input from "@/component/ui/Input";
import { useParams } from "react-router";
import Loader from "@/component/ui/Loader";
import Button from "@/component/ui/Button";
import ImageUpload from "@/component/ui/ImageUpload";
import { useSponsorsApi } from "@/hooks/useSponsorsApi";

export default function EditSponsorPage() {
  const { id } = useParams();
  const { useGetSponsorById, updateSponsor, uploadSponsorImage } =
    useSponsorsApi();
  const { data } = useGetSponsorById(id as unknown as number);
  const [name, setName] = useState("");
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (data) {
      setName(data.data.name);
      setExistingImage(data.data.image);
    }
  }, [data]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imageFile) return;
    updateSponsor.mutateAsync(
      { id: id as unknown as number, name },
      {
        onSuccess: () => {
          if (imageFile) {
            const formData = new FormData();
            formData.append("file", imageFile);
            uploadSponsorImage.mutateAsync({
              id: id as unknown as number,
              formData,
            });
          }
        },
      },
    );
  };

  return (
    <Suspense fallback={<Loader />}>
      <PageHeader
        title="Editar patrocinador"
        description="Edita los datos del patrocinador."
      />
      <form onSubmit={handleUpdate}>
        <Input
          id="edit-sponsor-name"
          type="text"
          title="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <ImageUpload
          onChange={(files) => setImageFile(files?.[0] ?? null)}
          accept="image/*"
        />
        <Button
          type="submit"
          className="mt-4"
          disabled={!name || !imageFile}
          label="Guardar"
        />
      </form>
    </Suspense>
  );
}
