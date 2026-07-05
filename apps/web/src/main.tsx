import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { KenkuZeroProvider } from "./zero/zero-provider.js";
import { App } from "./App.js";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("missing #root element");

createRoot(rootElement).render(
  <StrictMode>
    <KenkuZeroProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </KenkuZeroProvider>
  </StrictMode>,
);
