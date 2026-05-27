import { createContext, useContext, useEffect, useState } from "react";

import { api } from "@/api/apiClient";

const AuthContext = createContext();

function getResponseData(response) {
  // Unificamos acceso al payload porque toda la API responde { success, data }.
  return response?.data?.data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      setLoading(false);
      return;
    }

    // Si hay token, validamos contra /auth/me para evitar sesiones "fantasma".
    api
      .get("/auth/me")
      .then((res) => {
        const me = getResponseData(res);
        setUser(me);
        setIsAuthenticated(Boolean(me));
      })
      .catch(() => {
        localStorage.removeItem("auth_token");
        setUser(null);
        setIsAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    const payload = getResponseData(res);

    if (!payload?.token || !payload?.user) {
      throw new Error("Respuesta de login invalida");
    }

    localStorage.setItem("auth_token", payload.token);
    setUser(payload.user);
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

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}
