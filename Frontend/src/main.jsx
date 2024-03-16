import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext.jsx";
import { ThemeContextProvider } from "../context/ThemeContext.jsx";
import router from "@/Routes/AllRoutes.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);

export function RootLayout() {
  return (
    <>
      <AuthProvider>
        <ThemeContextProvider>
          <App />
        </ThemeContextProvider>
      </AuthProvider>
    </>
  );
}
