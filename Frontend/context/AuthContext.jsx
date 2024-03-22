import { createContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { backendUrl } from "../config/config";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(() => {
    const id = JSON.parse(localStorage.getItem("userId"));

    return id ?? null;
  });
  const [token, setToken] = useState(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      setIsAuthenticated(true);
    }
    return token;
  });
  const [csrfToken, setCsrfToken] = useState(null);

  useEffect(() => {
    getCsrfToken();
    const storedToken = JSON.parse(localStorage.getItem("token"));
    const expiryDate = JSON.parse(localStorage.getItem("expiryDate"));

    if (!storedToken || !expiryDate) {
      setIsAuthenticated(false);
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      logout();
      return;
    }

    const remainingMiliseconds = new Date(expiryDate) - new Date().getTime();
    setToken(storedToken);
    setIsAuthenticated(true);
    autoLogout(remainingMiliseconds);
  }, [token]);

  const autoLogout = (miliseconds) => {
    setTimeout(() => {
      logout();
    }, miliseconds);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    setToken(null);
    setIsAuthenticated(false);
  };

  async function getCsrfToken() {
    try {
      const response = await axios.get(`${backendUrl}/csrf-token`, {
        withCredentials: "include",
      });

      if (response.status === 200) {
        const data = await response.data;
        setCsrfToken(data.csrfToken);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const contextValue = useMemo(
    () => ({
      token,
      isAuthenticated,
      csrfToken,
      userId,
      login: async (storedToken, userId) => {
        setToken(storedToken);
        setUserId(userId);
        localStorage.setItem("token", JSON.stringify(storedToken));
        localStorage.setItem("userId", JSON.stringify(userId));
        const remainingMiliseconds = 60 * 60 * 1000; // miliseconds
        const expiryDate = new Date(
          new Date().getTime() + remainingMiliseconds
        );
        localStorage.setItem("expiryDate", JSON.stringify(expiryDate));
        setIsAuthenticated(true);

        autoLogout(remainingMiliseconds);
      },
      logout,
      autoLogout,
    }),
    [isAuthenticated, token, csrfToken]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
