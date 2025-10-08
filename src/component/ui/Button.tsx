import { cn } from "@/lib/cn";

interface ButtonProps {
  onClick?: () => void;
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
        "flex items-center justify-center gap-1 rounded bg-fourth px-3 py-3 text-center font-century-gothic text-lg font-bold text-white",
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
