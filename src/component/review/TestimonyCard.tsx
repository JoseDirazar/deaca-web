import { generateImageUrl } from "@/lib/generate-image-url";
import type { AppReview } from "@/types/reviews/app-review.interface";

export default function TestimonyCard({ appReview }: { appReview: AppReview }) {
  return (
    <div className="flex min-h-88 flex-col gap-4">
      <div className="relative mb-4 flex min-h-44 flex-col items-center justify-center rounded bg-white p-4 text-center font-bold text-gray-500 shadow-2xl">
        {appReview.comment.length > 120
          ? appReview.comment.slice(0, 120) + "..."
          : appReview.comment}
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-x-8 border-t-8 border-b-0 border-solid border-x-transparent border-t-white"></span>
      </div>
      <div className="flex w-auto flex-col items-center gap-1">
        <img
          className="h-10 w-10 rounded-full object-cover"
          src={generateImageUrl("user", appReview.user.avatar)}
          alt={appReview.user.firstName}
        />
        <p className="text-xl font-extrabold text-white">
          {appReview.user.firstName}
        </p>
        <p className="text-gray-200">
          {appReview.user?.establishments?.[0]?.name}
        </p>
      </div>
    </div>
  );
}
