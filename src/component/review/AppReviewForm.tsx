import { useAppReviewApi } from "@/hooks/useAppReviewApi.hook";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function AppReviewForm() {
  const { createReviewMutation } = useAppReviewApi();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createReviewMutation.mutate({
      comment: e.currentTarget.comment.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        name="comment"
        id="landing-app-review"
        title="Comentario"
        type="text"
      />
      <Button label="Enviar" type="submit" />
    </form>
  );
}
