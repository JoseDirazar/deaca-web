import { cn } from "@/lib/cn";

export default function PageHeader({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 font-century-gothic text-wrap",
        className,
      )}
    >
      <h1 className="text-3xl font-bold md:text-5xl">{title}</h1>
      <p className="text-xl text-gray-500">{description}</p>
    </div>
  );
}
