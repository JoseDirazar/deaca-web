import { useUserStore } from "@/context/useUserStore";
import type { Roles } from "@/types/common/roles.interface";
import { useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";

interface Props {
  children: ReactNode;
  roles?: Roles[];
}

export default function RequireAuth({ children, roles }: Props) {
  const { user, isUserLoaded } = useUserStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserLoaded) return;

    if (!user) {
      navigate("/auth/ingresar", {
        state: { from: location },
        replace: true,
      });
      return;
    }

    if (roles && !roles.includes(user.role)) {
      // Intentar volver atrás, o ir al home si no hay historial
      if (window.history.length > 2) {
        navigate(-1);
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, isUserLoaded, roles, location, navigate]);

  if (!isUserLoaded) return null;
  if (!user) return null;
  if (roles && !roles.includes(user.role)) return null;

  return <>{children}</>;
}
