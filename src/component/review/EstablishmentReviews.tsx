import { useReviewsApi } from "@/hooks/useReviewsApi.hook";
import type { Review } from "@/types/reviews/review.interface";
import type { User } from "@/types/user/user.interface";
import { useState } from "react";
import type { Establishment } from "@/types/establishment/etablihment.interface";
import ReviewForm from "../establishment/ReviewForm";
import UserAvatar from "../ui/user/UserAvatar";
import StarRating from "../ui/StarRating";
import Button from "../ui/Button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { reviewService } from "@/api/review-service";

export default function EstablishmentReviews({
  establishment,
  user,
}: {
  establishment: Establishment;
  user?: User | null;
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const { createReview, updateReview, deleteReview } = useReviewsApi();

  const { data: reviews } = useSuspenseQuery({
    queryKey: ["reviews", establishment.id],
    queryFn: () =>
      reviewService
        .getReviewsByEstablishmentId(establishment.id)
        .then((res) => res.data.data),
  });
  const handleDelete = async (review: Review) => {
    try {
      await deleteReview.mutateAsync({ reviewId: review.id });
    } catch (e) {
      console.error(e);
    }
  };

  const onEdit = (review: Review) => {
    setEditingReview(review);
    setIsFormOpen(true);
  };

  const onSubmit = async (rating: number, comment: string) => {
    try {
      if (editingReview) {
        await updateReview.mutateAsync({
          review: { ...editingReview, rating, comment } as Review,
        });
      } else {
        await createReview.mutateAsync({
          establishmentId: establishment.id,
          review: { rating, comment },
        });
      }
      setIsFormOpen(false);
      setEditingReview(null);
    } catch {
      // Swallow error; UI libs likely handle toasts globally
    }
  };

  if (!reviews) {
    return (
      <div className="text-center text-2xl text-gray-400">
        <p>No hay reseñas</p> <p>Sea el primero en calificar</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StarRating
            rating={Math.round(establishment.rating || 0)}
            readonly
            size={22}
          />
          <span className="text-lg">
            {Number(establishment.rating || 0).toFixed(1)}
          </span>
          <span className="text-sm text-gray-400">
            ({reviews?.length || 0} reseñas)
          </span>
        </div>
        {user && (
          <Button
            onClick={() => {
              const myReview =
                (reviews || []).find((r) => r.reviewer.id === user.id) || null;
              setEditingReview(myReview);
              setIsFormOpen(true);
            }}
            label={
              (reviews || []).some((r) => r.reviewer.id === user.id)
                ? "Editar mi reseña"
                : "Escribir reseña"
            }
          />
        )}
      </div>
      {isFormOpen && user && (
        <div className="mb-6 rounded-lg border border-primary/30 p-4">
          <ReviewForm
            initialReview={editingReview || undefined}
            isLoading={createReview.isPending || updateReview.isPending}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingReview(null);
            }}
            onSubmit={onSubmit}
          />
        </div>
      )}

      <div className="flex-grow">
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex gap-4 rounded-lg border border-primary/20 p-4"
            >
              <UserAvatar avatar={review.reviewer.avatar} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-century-gothic-bold text-lg">
                      {review.reviewer.firstName} {review.reviewer.lastName}
                    </p>
                    <StarRating rating={review.rating} readonly size={18} />
                  </div>

                  {user && user?.id === review.reviewer.id && (
                    <div className="flex gap-2">
                      <Button
                        label="Editar"
                        onClick={() => onEdit(review)}
                        className="bg-secondary hover:bg-secondary/90"
                      />
                      <Button
                        label="Eliminar"
                        onClick={() => handleDelete(review)}
                        className="bg-red-500 hover:bg-red-600"
                      />
                    </div>
                  )}
                </div>
                <p className="mt-2 text-fourth">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
