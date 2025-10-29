import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";

import { APIProvider } from "@vis.gl/react-google-maps";
import Bootstrapper from "./context/Bootstrapper.tsx";
import { Toaster } from "./component/ui/Sonner.tsx";
import { queryClient } from "./context/query-client-instance.ts";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { googleClientId } from "./lib/constants/enviroment-variables.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <Toaster />
            <Bootstrapper />
          </QueryClientProvider>
        </BrowserRouter>
      </APIProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
