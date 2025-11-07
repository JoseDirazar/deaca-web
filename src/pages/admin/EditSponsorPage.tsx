import PageHeader from "@/component/PageHeader";
import { Suspense, useEffect, useState } from "react";
import Input from "@/component/ui/Input";
import { useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { sponsorService } from "@/api/sponsor-service";
import Loader from "@/component/ui/Loader";
import Button from "@/component/ui/Button";
import ImageUpload from "@/component/ui/ImageUpload";

export default function EditSponsorPage() {
  const [name, setName] = useState("");
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { id } = useParams();

  const { data } = useQuery({
    queryKey: ["sponsor", id],
    queryFn: () =>
      sponsorService
        .getSponsorById(id as unknown as number)
        .then((res) => res.data),
    enabled: Boolean(id),
  });

  const { mutateAsync: updateSponsor } = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      sponsorService.updateSponsor(id, name),
  });

  const { mutate: uploadSponsorImage } = useMutation({
    mutationFn: ({ id, file }: { id: number; file: FormData }) =>
      sponsorService.uploadSponsorImage(id, file),
  });

  useEffect(() => {
    if (data) {
      setName(data.data.name);
      setExistingImage(data.data.image);
    }
  }, [data]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imageFile) return;
    updateSponsor(
      { id: id as unknown as number, name },
      {
        onSuccess: () => {
          if (imageFile) {
            const formData = new FormData();
            formData.append("file", imageFile);
            uploadSponsorImage({ id: id as unknown as number, file: formData });
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
