import { cn } from "@/lib/cn";
import type { MouseEventHandler } from "react";

interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  label?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary";
  loading?: boolean;
}
export default function Button({
  label,
  type,
  className,
  disabled,
  onClick,
  icon,
  variant = "primary",
  loading = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "flex items-center justify-center gap-1 rounded px-3 py-3 text-center font-century-gothic text-lg font-bold transition-colors duration-100 hover:cursor-pointer disabled:opacity-50",
        variant === "secondary"
          ? "bg-white text-fourth ring-1 ring-fourth hover:bg-gray-50"
          : "bg-fourth text-white hover:bg-fourth/90 hover:ring-1 hover:ring-fourth",
        className,
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        icon
      )}
      {label}
    </button>
  );
}
