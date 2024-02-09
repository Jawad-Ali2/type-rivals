import { createContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    //console.log("from useState", token);
    if (token) {
      setIsAuthenticated(true);
    }
    return token;
  });
  const [csrfToken, setCsrfToken] = useState(null);
  //console.log("csrf", csrfToken);

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
    //console.log("in useEffect", storedToken);
    setToken(storedToken);
    setIsAuthenticated(true);
    autoLogout(remainingMiliseconds);
  }, []);

  const autoLogout = (miliseconds) => {
    //console.log("inside auto-logout");
    //console.log(miliseconds);
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
      const response = await fetch("http://localhost:8000/csrf-token", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        //console.log(data);
        setCsrfToken(data.csrfToken);
      }
    } catch (err) {
      //console.log(err);
    }
  }
  //console.log(csrfToken);

  const contextValue = useMemo(
    () => ({
      token,
      isAuthenticated,
      csrfToken,
      login: async (storedToken) => {
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
    [isAuthenticated, token, csrfToken]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
