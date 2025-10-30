import { useAppReviewApi } from "@/hooks/useAppReviewApi.hook";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { useState } from "react";
import TestimonyCard from "./TestimonyCard";
import { FaStar } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

export default function AppReviewForm() {
  const { createReviewMutation, getReviewForUser } = useAppReviewApi();
  const { data } = getReviewForUser;

  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createReviewMutation.mutate({
      comment: e.currentTarget.comment.value,
    });
    setIsOpen(false);
  };

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            name="comment"
            id="user-dashboard-app-review"
            title="Comentario"
            className="w-full resize-none rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-primary focus:outline-none"
            rows={4}
            value={data?.data?.comment || ""}
          />
          <div className="flex items-center justify-end">
            <Button
              label="Enviar"
              type="submit"
              disabled={createReviewMutation.isPending}
            />
          </div>
        </form>
      </Modal>
    </>
  );
}
