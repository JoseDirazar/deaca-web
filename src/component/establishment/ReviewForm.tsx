import { useState, useEffect } from "react";
import Button from "@/component/ui/Button";
import StarRating from "@/component/ui/StarRating";
import type { Review } from "@/types/reviews/review.interface";

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => void;
  onCancel: () => void;
  initialReview?: Review | null;
  isLoading?: boolean;
}

export default function ReviewForm({
  onSubmit,
  onCancel,
  initialReview,
  isLoading = false,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialReview?.rating || 0);
  const [comment, setComment] = useState(initialReview?.comment || "");

  useEffect(() => {
    if (initialReview) {
      setRating(initialReview.rating);
      setComment(initialReview.comment);
    }
  }, [initialReview]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0) {
      onSubmit(rating, comment);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="font-century-gothic-bold mb-2 block text-lg text-fourth">
          Calificación
        </label>
        <StarRating rating={rating} onRatingChange={setRating} size={32} />
        {rating === 0 && (
          <p className="mt-1 text-sm text-red-500">
            Por favor selecciona una calificación
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="comment"
          className="font-century-gothic-bold mb-2 block text-lg text-fourth"
        >
          Comentario
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[120px] w-full rounded-md border border-primary bg-transparent p-3 text-fourth focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          placeholder="Comparte tu experiencia..."
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          onClick={onCancel}
          label="Cancelar"
          className="bg-gray-50 text-fourth ring-1 ring-fourth hover:bg-fourth hover:text-white"
        />
        <Button
          type="submit"
          label={initialReview ? "Actualizar" : "Publicar"}
          disabled={rating === 0 || isLoading}
        />
      </div>
    </form>
  );
}
