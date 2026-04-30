import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/apiClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar sesión desde localStorage
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data);
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem("auth_token");
        setIsAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    localStorage.setItem("auth_token", res.data.token);
    setUser(res.data.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
