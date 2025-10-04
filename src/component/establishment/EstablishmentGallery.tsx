import { generateImageUrl } from "@/lib/generate-image-url";
import type { Image } from "@/types/common/image.interface";
import { FaArrowLeft, FaArrowRight, FaX } from "react-icons/fa6";

export default function EstablishmentGallery({
  imageSelected,
  setImageSelected,
  handleSelectedImage,
  images,
}: {
  imageSelected: Image | null;
  setImageSelected: (image: Image | null) => void;
  handleSelectedImage: (imageId: string, motion: "r" | "l") => void;
  images: Image[];
}) {
  return (
    <>
      {imageSelected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div
            className="absolute inset-0"
            onClick={() => setImageSelected(null)}
          />

          <button
            onClick={() => handleSelectedImage(imageSelected.id, "l")}
            className="absolute left-4 z-10 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <FaArrowLeft className="h-6 w-6" />
          </button>

          <div className="relative z-10 max-h-[90vh] max-w-[90vw]">
            <img
              src={generateImageUrl("establishment", imageSelected.fileName)}
              alt={`Gallery image`}
              className="max-h-full max-w-full rounded-lg object-contain"
            />

            <button
              onClick={() => setImageSelected(null)}
              className="absolute top-4 right-4 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70"
            >
              <FaX />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded-full bg-black/50 px-3 py-1 text-sm font-bold text-white antialiased">
              {(images.findIndex((img) => img.id === imageSelected.id) || 0) +
                1}{" "}
              / {images.length}
            </div>
          </div>

          <button
            onClick={() => handleSelectedImage(imageSelected.id, "r")}
            className="absolute right-4 z-10 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <FaArrowRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
