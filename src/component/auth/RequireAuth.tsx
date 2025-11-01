import { useUserStore } from "@/context/useUserStore";
import type { Roles } from "@/types/enums/roles.interface.enum";
import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

interface Props {
  children: ReactNode;
  roles?: Roles[];
}

export default function RequireAuth({ children, roles }: Props) {
  const { user, isUserLoaded } = useUserStore();
  const location = useLocation();

  const previousPage = location.state?.from || "/";

  if (!isUserLoaded) return null;
  if (!user) return <Navigate to="/auth/ingresar" />;
  if (roles && !roles.includes(user.role))
    return <Navigate to={previousPage} />;

  return <>{children}</>;
}
