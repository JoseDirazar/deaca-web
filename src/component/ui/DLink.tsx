import { cn } from "@/lib/cn";
import { Link } from "react-router";

interface DLinkProps {
  to: string;
  label: string;
  className?: string;
  icon?: React.ReactNode;
}

export default function DLink({ to, label, className, icon }: DLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 rounded-xl px-3 py-2 text-center font-century-gothic font-bold text-primary hover:underline",
        className,
      )}
    >
      {icon}
      {label}
    </Link>
  );
}
