import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";

import { APIProvider } from "@vis.gl/react-google-maps";
import Bootstrapper from "./context/Bootstrapper.tsx";
import { Toaster } from "./component/ui/Sonner.tsx";
import { queryClient } from "./context/query-client-instance.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <Bootstrapper />
        </QueryClientProvider>
      </BrowserRouter>
    </APIProvider>
  </StrictMode>,
);
