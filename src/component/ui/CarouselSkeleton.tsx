export default function CarouselSkeleton({
  bgColor = "bg-gray-50",
}: {
  bgColor?: string;
}) {
  return (
    <div className="flex items-center justify-around gap-4">
      <div className="relative z-20 flex aspect-square w-[200px] animate-pulse flex-col items-start justify-end gap-2 px-2 py-1">
        <h2 className={`h-10 w-2/3 rounded ${bgColor}/50`}></h2>

        <div
          className={`absolute inset-0 -z-10 h-full w-full rounded ${bgColor}`}
        ></div>
      </div>
      <div className="relative z-20 flex aspect-square w-[200px] animate-pulse flex-col items-start justify-end gap-2 px-2 py-1">
        <h2 className={`h-10 w-2/3 rounded ${bgColor}`}></h2>

        <div
          className={`absolute inset-0 -z-10 h-full w-full rounded ${bgColor}`}
        ></div>
      </div>
      <div className="relative z-20 flex aspect-square w-[200px] animate-pulse flex-col items-start justify-end gap-2 px-2 py-1">
        <h2 className={`h-10 w-2/3 rounded ${bgColor}`}></h2>

        <div
          className={`absolute inset-0 -z-10 h-full w-full rounded ${bgColor}`}
        ></div>
      </div>
    </div>
  );
}
