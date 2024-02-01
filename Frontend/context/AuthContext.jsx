import { createContext, useMemo, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      login: () => {
        setIsAuthenticated(true);
      },
      logout: () => {
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
