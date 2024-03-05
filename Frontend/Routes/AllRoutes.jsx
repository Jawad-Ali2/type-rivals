import { createBrowserRouter } from "react-router-dom";
import { Home, Dashboard, Landing, Race, Auth, Narrator } from "../pages";
import { RootLayout } from "../src/main";
import axios from "axios";
import { raceLoader } from "../pages/Race/Race";

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
