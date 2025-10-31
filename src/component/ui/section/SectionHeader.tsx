import { cn } from "@/lib/cn";

export default function SectionHeader({
  className,
  title,
  subtitle,
  description,
  descriptionClassName,
  separator,
  separatorClassName,
}: {
  className?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  descriptionClassName?: string;
  separator?: boolean;
  separatorClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 text-center font-century-gothic text-[29px] font-bold tracking-wide",
        className,
      )}
    >
      <p>{title}</p>
      {subtitle && <p>{subtitle}</p>}
      {description && (
        <p className={cn("text-gray-400", descriptionClassName)}>
          {description}
        </p>
      )}
      {separator && (
        <div
          className={cn(
            "h-[2px] w-20 rounded-full bg-fourth",
            separatorClassName,
          )}
        />
      )}
    </div>
  );
}
