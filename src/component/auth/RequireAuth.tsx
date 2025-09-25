import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useUserStore } from "../../context/useUserStore";

interface Props {
  children: ReactNode;
}

export default function RequireAuth({ children }: Props) {
  const { user, isUserLoaded } = useUserStore();
  const location = useLocation();

  if (!isUserLoaded) return null;

  if (!user) {
    return (
      <Navigate
        to="/auth/sign-in"
        state={{ from: location }}
        replace
      />
    );
  }

  return <>{children}</>;
}
