import { useAuthApi } from "@/hooks/useAuthApi.hook";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  setShowDropdownMenu: Dispatch<SetStateAction<boolean>>;
  label?: string;
}

export default function SignOutButton({
  setShowDropdownMenu,
  label = "Cerrar sesión",
}: Props) {
  const { signOut } = useAuthApi();
  const { mutateAsync: signOutAsync, isPending: isSigningOut } = signOut;

  const onClick = () => {
    signOutAsync();
    setShowDropdownMenu(false);
  };

  return (
    <button
      onClick={onClick}
      disabled={isSigningOut}
      className="py-2 font-bold text-fourth"
    >
      {isSigningOut ? "Cerrando..." : label}
    </button>
  );
}
