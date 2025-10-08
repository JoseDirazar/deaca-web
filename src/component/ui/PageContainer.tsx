import { cn } from "@/lib/cn";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({
  children,
  className,
}: PageContainerProps) {
  return (
    <div className={cn("flex h-[calc(100vh-5rem)] flex-col", className)}>
      {children}
    </div>
  );
}
