import CardSkeleton from "./CardSkeleton";

export default function CardsLoader() {
  return (
    <div className="flex flex-col gap-3">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}
