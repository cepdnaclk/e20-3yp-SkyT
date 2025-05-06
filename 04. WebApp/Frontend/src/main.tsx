import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";
import { LoadingProvider } from "./context/LoadingProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LoadingProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LoadingProvider>
  </StrictMode>
);
