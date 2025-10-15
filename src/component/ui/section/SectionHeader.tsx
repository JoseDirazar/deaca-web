import { cn } from "@/lib/cn";

export default function SectionHeader({
  className,
  title,
  subtitle,
  description,
  descriptionClassName,
}: {
  className?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  descriptionClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 text-center font-century-gothic text-[29px] tracking-wide",
        className,
      )}
    >
      <p>{title}</p>
      {subtitle && <p>{subtitle}</p>}
      {description && (
        <p className={cn("text-gray-500", descriptionClassName)}>
          {description}
        </p>
      )}
    </div>
  );
}
