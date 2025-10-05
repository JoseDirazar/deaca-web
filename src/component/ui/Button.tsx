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
        "font-century-gothic-bold flex items-center justify-center gap-1 rounded bg-fourth px-3 py-2 text-center text-white",
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
