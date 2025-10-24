import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { cn } from "@/lib/cn";

interface InputProps {
  type: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  disabled?: boolean;
  id: string;
  required?: boolean;
  title: string;
}

export default function Input({
  type,
  className,
  value,
  onChange,
  name,
  disabled,
  id,
  required,
  title,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = id.split("-").includes("password");
  return (
    <div className="relative w-full font-century-gothic font-bold">
      <input
        type={showPassword ? "text" : type}
        className={cn(
          "peer h-12 w-full rounded-md border border-primary bg-transparent p-3 text-lg font-medium tracking-widest text-fourth placeholder-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none disabled:opacity-50",
          className,
        )}
        value={value}
        onChange={onChange}
        placeholder=" "
        name={name}
        disabled={disabled}
        id={id}
        required={required}
        {...rest}
      />

      <label
        onClick={() => document.getElementById(id)?.focus()}
        htmlFor={id}
        className={cn(
          "absolute -top-[10px] left-3 h-fit w-fit bg-gray-50 px-1 text-sm text-primary transition-all duration-200 select-none peer-placeholder-shown:top-[12px] peer-placeholder-shown:text-base peer-placeholder-shown:text-primary peer-focus:-top-[10px] peer-focus:text-sm peer-focus:text-primary",
          className,
        )}
      >
        {title}
      </label>

      {isPassword && (
        <button
          type="button"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-primary hover:text-fourth"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
        </button>
      )}
    </div>
  );
}
