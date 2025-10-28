export default function CardSkeleton() {
  return (
    <div className="relative flex h-fit w-full rounded-md bg-gray-50 shadow-md">
      <div className="h-40 w-40 animate-pulse rounded-l-md bg-gray-200 transition-all" />

      <div className="flex w-3/5 flex-col justify-between gap-2 p-3">
        <div className="flex w-full flex-col gap-2">
          <div className="h-4 animate-pulse rounded bg-gray-200 transition-all" />
          <div className="h-4 animate-pulse rounded bg-gray-200 transition-all" />
        </div>
        <div className="h-4 animate-pulse rounded bg-gray-200 transition-all" />
      </div>
      <div className="absolute top-1 right-1 text-xs">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200 transition-all" />
      </div>
    </div>
  );
}
