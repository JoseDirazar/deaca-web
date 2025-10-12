import { useState } from "react";

interface ImageUploadProps {
  multiple?: boolean;
  onChange: (files: FileList | null) => void;
  accept?: string;
  maxFiles?: number;
}

export default function ImageUpload({
  multiple = false,
  onChange,
  accept = "image/*",
  maxFiles = 10,
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [fileCount, setFileCount] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    const files = e.target.files;
    if (!files) {
      setPreviews([]);
      setFileCount(0);
      onChange(null);
      return;
    }

    setFileCount(files.length);
    onChange(files);

    // Generate previews
    const newPreviews: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="block w-full text-sm font-extrabold text-gray-400 file:mr-4 file:rounded file:border-0 file:bg-fourth/50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-fourth"
      />
      {previews.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {previews.map((preview, idx) => (
            <img
              key={idx}
              src={preview}
              alt={`Preview ${idx + 1}`}
              className="h-20 w-20 rounded border border-gray-200 object-cover"
            />
          ))}
        </div>
      )}
      {fileCount > 0 && (
        <p className="mt-2 text-xs text-primary">
          {fileCount} archivo(s) seleccionado(s)
        </p>
      )}
      {multiple && maxFiles && (
        <p className="mt-1 text-xs text-gray-500">Máximo {maxFiles} archivos</p>
      )}
    </div>
  );
}
