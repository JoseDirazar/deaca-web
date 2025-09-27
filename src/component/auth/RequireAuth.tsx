import { useUserStore } from "@/context/useUserStore";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

interface Props {
  children: ReactNode;
}

export default function RequireAuth({ children }: Props) {
  const { user, isUserLoaded } = useUserStore();
  const location = useLocation();

  if (!isUserLoaded) return null;

  if (!user) {
    // TODO redirigir a la ruta correspondiente una vez logueado el usuario
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
