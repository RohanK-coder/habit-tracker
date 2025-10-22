import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToasterProvider } from "@/components/ui/toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToasterProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToasterProvider>
    </BrowserRouter>
  </React.StrictMode>
);
