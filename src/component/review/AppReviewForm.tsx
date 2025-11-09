import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaStar } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { useAppReviewsApi } from "@/hooks/useAppReviewsApi.hook";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import TestimonyCard from "./TestimonyCard";
import { useUserStore } from "@/context/useUserStore";
import { Roles } from "@/types/enums/roles.interface.enum";

const reviewFormSchema = z.object({
  comment: z
    .string()
    .min(10, "El comentario debe tener al menos 10 caracteres"),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

export default function AppReviewForm() {
  const { useCreateAppReview, useGetReviewForUser } = useAppReviewsApi();
  const { data } = useGetReviewForUser;
  const { user } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      comment: data?.data?.comment || "",
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    try {
      await useCreateAppReview.mutateAsync({
        comment: data.comment,
      });
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  // Only show the form for users with role "user"
  if (user?.role === Roles.USER) {
    return null;
  }

  return (
    <>
      {data?.data ? (
        <>
          <p className="text-xl font-bold">
            Gracias por tu calificación. Una vez aprobada se mostrara en la
            pagina principal
          </p>
          <div className="relative w-sm bg-primary p-4">
            <Button
              icon={<FaEdit />}
              onClick={() => setIsOpen(true)}
              className="absolute top-2 right-2 z-20"
            />
            <TestimonyCard appReview={data?.data} />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">
            Deja un comentario sobre{" "}
            <p className="inline-block font-nueva text-3xl font-bold text-primary">
              deacá
            </p>{" "}
          </span>
          <Button
            label="Calificar"
            onClick={() => setIsOpen(true)}
            icon={<FaStar />}
          />
        </div>
      )}
      <Modal setIsOpen={setIsOpen} isOpen={isOpen}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <textarea
              id="user-dashboard-app-review"
              title="Comentario"
              className={`w-full resize-none rounded-md border p-2 focus:ring-2 focus:outline-none ${
                errors.comment
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-primary"
              }`}
              rows={4}
              {...register("comment")}
              disabled={useCreateAppReview.isPending}
            />
            {errors.comment && (
              <p className="mt-1 text-sm text-red-500">
                {errors.comment.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
              disabled={useCreateAppReview.isPending}
              label="Cancelar"
            />
            <Button
              type="submit"
              disabled={useCreateAppReview.isPending}
              loading={useCreateAppReview.isPending}
              label={useCreateAppReview.isPending ? "Enviando..." : "Enviar"}
            />
          </div>
        </form>
      </Modal>
    </>
  );
}
