import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

const backendUrl = import.meta.env.VITE_RENDER_BACKEND_URL;
if (backendUrl) {
  setBaseUrl(backendUrl);
}

createRoot(document.getElementById("root")!).render(<App />);
