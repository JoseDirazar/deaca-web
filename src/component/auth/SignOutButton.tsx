import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth.hook";

interface Props {
  redirectTo?: string;
  label?: string;
}

export default function SignOutButton({ redirectTo = "/", label = "Cerrar sesión" }: Props) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const onClick = async () => {
    try {
      await signOut.mutateAsync();
      navigate(redirectTo, { replace: true });
    } catch (e) {
      // useAuth ya muestra toast de error
    }
  };

  return (
    <button onClick={onClick} disabled={signOut.isPending}>
      {signOut.isPending ? "Cerrando..." : label}
    </button>
  );
}
