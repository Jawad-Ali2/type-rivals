import { Routes, Route } from "react-router-dom";
import { Home, Dashboard, Landing, Race, Auth } from "../pages";
import { AuthProvider } from "../context/AuthContext";
export const AllRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<Landing />} />
      <Route path="/home" element={<Home />}></Route>
      <Route path="/dashboard" element={<Dashboard />}></Route>
      <Route path="/race" element={<Race />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
};
