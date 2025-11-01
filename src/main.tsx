
import { createRoot } from "react-dom/client";
import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
    <Analytics />
  </BrowserRouter>
);
  