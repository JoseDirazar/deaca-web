import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export default function SectionBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("p-4", className)}>{children}</div>;
}
