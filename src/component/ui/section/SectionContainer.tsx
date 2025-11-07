import { cn } from "@/lib/cn";
import { Suspense, type ReactNode } from "react";
import Loader from "../Loader";

export default function SectionContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Suspense fallback={<Loader />}>
      <div className={cn("rounded-lg bg-gray-50 md:p-4", className)}>
        {children}
      </div>
    </Suspense>
  );
}
