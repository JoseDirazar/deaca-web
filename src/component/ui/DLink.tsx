import { cn } from "@/lib/cn";
import { Link } from "react-router";

interface DLinkProps {
  to: string;
  label: string;
  className?: string;
}

export default function DLink({ to, label, className }: DLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "rounded-xl px-3 py-2 text-center font-century-gothic-bold text-primary hover:underline",
        className,
      )}
    >
      {label}
    </Link>
  );
}
