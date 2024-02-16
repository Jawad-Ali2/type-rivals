import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext.jsx";
import { ThemeContextProvider } from "../context/ThemeContext.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeContextProvider>
        <Router>
          <App />
        </Router>
      </ThemeContextProvider>
    </AuthProvider>
  </React.StrictMode>
);
