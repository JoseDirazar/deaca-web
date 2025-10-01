import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useUserStore } from "@/context/useUserStore";
import { bootstrapAuth } from "@/api/axios-instance";

const queryClient = new QueryClient();

function Bootstrapper() {
  const { isUserLoaded, setIsUserLoaded } = useUserStore();

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      try {
        await bootstrapAuth();
      } catch (e) {
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
