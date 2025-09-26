import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useUserStore } from "@/context/useUserStore";
import { userService } from "@/api/user-service";

const queryClient = new QueryClient();

function Bootstrapper() {
  const { isUserLoaded, setIsUserLoaded, setUser, clearUser } = useUserStore();

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      try {
        const accessToken = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");
        if (!accessToken || !refreshToken) {
          clearUser();
          return;
        }
        const res = await userService.getUser();
        if (!cancelled && res?.data?.ok) {
          setUser(res.data.user);
        }
      } catch (e) {
        // any error -> assume not authenticated
        clearUser();
      } finally {
        if (!cancelled) setIsUserLoaded(true);
      }
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [setIsUserLoaded, setUser, clearUser]);

  if (!isUserLoaded) return null;
  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Bootstrapper />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
