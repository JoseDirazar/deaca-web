import { cn } from "@/lib/cn";
import type { MouseEventHandler } from "react";

interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  label?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}
export default function Button({
  label,
  type,
  className,
  disabled,
  onClick,
  icon,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "flex items-center justify-center gap-1 rounded bg-fourth px-3 py-3 text-center font-century-gothic text-lg font-bold text-white disabled:opacity-50",
        className,
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}
