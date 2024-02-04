import { createContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    return token;
  });

  useEffect(() => {
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
    console.log(storedToken);
    setToken(storedToken);
    setIsAuthenticated(true);
    autoLogout(remainingMiliseconds);
  }, []);

  const autoLogout = (miliseconds) => {
    console.log("inside auto-logout");
    console.log(miliseconds);
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

  const contextValue = useMemo(
    () => ({
      token,
      isAuthenticated,
      login: (storedToken) => {
        setToken(storedToken);
        localStorage.setItem("token", JSON.stringify(storedToken));
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
    [isAuthenticated]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
