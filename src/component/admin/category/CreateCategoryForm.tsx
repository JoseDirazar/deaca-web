import Button from "@/component/ui/Button";
import ImageUpload from "@/component/ui/ImageUpload";
import Input from "@/component/ui/Input";
import { FaPlus } from "react-icons/fa6";

interface CreateCategoryFormProps {
  handleCreateCategory: (
    e: React.FormEvent,
  ) => Promise<string | number | undefined>;
  setIconFile: (file: File | null) => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  isPending: boolean;
}

export default function CreateCategoryForm({
  handleCreateCategory,
  setIconFile,
  newCategoryName,
  setNewCategoryName,
  isPending,
}: CreateCategoryFormProps) {
  return (
    <form onSubmit={handleCreateCategory} className="flex flex-col gap-8">
      <p className="text-sm font-medium text-gray-700">Icono</p>
      <ImageUpload
        onChange={(files) => setIconFile(files?.[0] ?? null)}
        accept="image/*"
      />

      <Input
        id="category-name"
        type="text"
        title="Nombre"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        required
      />

      <div className="mt-10 flex w-full justify-end">
        <Button
          type="submit"
          label="Crear"
          icon={<FaPlus />}
          disabled={isPending}
        />
      </div>
    </form>
  );
}
