import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export default function SectionContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg bg-fifth p-4", className)}>{children}</div>
  );
}
