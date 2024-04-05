import { Navigate, createBrowserRouter } from "react-router-dom";

import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";
import Race from "@/pages/Race";
import Auth from "@/pages/Auth";
import Narrator from "@/pages/Narrator";
import { RootLayout } from "@/main";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Modal } from "@/components/Modal";

const ProtectedRoute = ({ element, path }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated && path === "/auth") return <Navigate to="/" />;

  if (!isAuthenticated && path !== "/auth") {
    return <Navigate to="/auth" />;
  }

  return element;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "dashboard",
        element: <ProtectedRoute element={<Dashboard />} path="/dashboard" />,
      },
      {
        path: "race",
        element: <ProtectedRoute element={<Race />} path="/race" />,
        // element: <Race />,
        // loader: raceLoader,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "narrator",
        element: <ProtectedRoute element={<Narrator />} path="/narrator" />,
      },
    ],
  },
]);

export default router;
