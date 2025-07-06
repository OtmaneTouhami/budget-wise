import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { runApiDiagnostics } from "./api/api-diagnostics";

// Run API connectivity diagnostics on startup
// This will help identify connection issues early
runApiDiagnostics().catch((error) => {
  console.error("Failed to run API diagnostics:", error);
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
