import { createBrowserRouter } from "react-router-dom";

import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";
import Race from "@/pages/Race";
import Auth from "@/pages/Auth";
import Narrator from "@/pages/Narrator";
import { RootLayout } from "@/main";
import axios from "axios";


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
        element: <Dashboard />,
      },
      {
        path: "race",
        element: <Race />,
        // loader: raceLoader,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "narrator",
        element: <Narrator />,
      },
    ],
  },
]);

export default router;
