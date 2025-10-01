import { useNavigate } from "react-router";
import { useAuthApi } from "@/hooks/useAuthApi.hook";

interface Props {
  redirectTo?: string;
  label?: string;
}

export default function SignOutButton({
  redirectTo = "/",
  label = "Cerrar sesión",
}: Props) {
  const { signOut } = useAuthApi();
  const { mutateAsync: signOutAsync, isPending: isSigningOut } = signOut;
  const navigate = useNavigate();

  const onClick = async () => {
    try {
      await signOutAsync();
      navigate(redirectTo, { replace: true });
    } catch (e) {
      // useAuth ya muestra toast de error
    }
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
