import { useEffect } from "react";
import { useUserStore } from "./useUserStore";
import { bootstrapAuth } from "../api/axios-instance";
import App from "../App";

export default function Bootstrapper() {
  const { isUserLoaded, setIsUserLoaded } = useUserStore();

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      try {
        await bootstrapAuth();
      } catch (e) {
        console.error(e);
        // swallow
      } finally {
        if (!cancelled) setIsUserLoaded(true);
      }
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [setIsUserLoaded]);

  if (!isUserLoaded) return null;
  return <App />;
}
