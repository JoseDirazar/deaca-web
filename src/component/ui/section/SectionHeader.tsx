import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export default function SectionHeader({
  className,
  title,
  subtitle,
  description,
}: {
  className?: string;
  title?: string;
  subtitle?: string;
  description?: string;
}) {
  return (
    <div className={cn("bg-fifth p-4", className)}>
      <p className="font-century-gothic text-4xl font-bold">{title}</p>
      {subtitle && <p>{subtitle}</p>}
      {description && <p>{description}</p>}
    </div>
  );
}
