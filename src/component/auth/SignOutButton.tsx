import { useNavigate } from "react-router";
import { useAuthApi } from "@/hooks/useAuthApi.hook";
import { useUserStore } from "@/context/useUserStore";

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
  const {setUser} = useUserStore()

  const onClick = () => {
    
      signOutAsync();
      setUser(null)
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      navigate(redirectTo, { replace: true });
    
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
