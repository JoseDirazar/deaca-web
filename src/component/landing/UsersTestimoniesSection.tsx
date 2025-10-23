import { generateImageUrl } from "@/lib/generate-image-url";
import type { AppReview } from "@/types/reviews/app-review.interface";

export default function UsersTestimoniesSection({
  appReviews,
}: {
  appReviews?: AppReview[];
}) {
  if (appReviews?.length === 0)
    return (
      <div className="text-center text-xl font-bold text-gray-300 md:text-2xl">
        No hay revisiones sobre{" "}
        <span className="font-nueva text-2xl md:text-3xl">deacá</span>
      </div>
    );

  return (
    <div className="flew-wrap flex gap-4 bg-primary p-4">
      {appReviews?.map((appReview) => (
        <TestimonyCard appReview={appReview} />
      ))}
    </div>
  );
}

function TestimonyCard({ appReview }: { appReview: AppReview }) {
  return (
    <div
      key={appReview.id}
      className="flex w-full flex-col items-center justify-center gap-4 rounded bg-primary p-4"
    >
      <article className="relative mb-4 rounded bg-white p-4 text-center text-xl font-bold text-gray-500 md:text-2xl">
        {appReview.comment.length > 120
          ? appReview.comment.slice(0, 120) + "..."
          : appReview.comment}
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-x-8 border-t-8 border-b-0 border-solid border-x-transparent border-t-white"></span>
      </article>
      <div className="flex flex-col items-center gap-1">
        <img
          className="h-24 w-24 rounded-full object-cover"
          src={generateImageUrl("user", appReview.user.avatar)}
          alt=""
        />
        <p className="text-xl font-extrabold text-white">
          {appReview.user.firstName}
        </p>
        <p className="text-gray-200">
          {appReview.user?.establishments?.[0].name}
        </p>
      </div>
    </div>
  );
}
