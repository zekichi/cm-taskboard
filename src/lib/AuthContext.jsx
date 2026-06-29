import { createContext, useCallback, useContext, useEffect, useState } from "react";

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
  const [sessionMessage, setSessionMessage] = useState("");

  const clearSession = useCallback((message = "") => {
    localStorage.removeItem("auth_token");
    setUser(null);
    setIsAuthenticated(false);
    setSessionMessage(message);
  }, []);

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
        clearSession("Tu sesión expiró. Inicia sesión nuevamente.");
      })
      .finally(() => setLoading(false));
  }, [clearSession]);

  useEffect(() => {
    const handleExpiredSession = () => {
      clearSession("Tu sesión expiró. Inicia sesión nuevamente.");
    };

    window.addEventListener("auth:expired", handleExpiredSession);
    return () => window.removeEventListener("auth:expired", handleExpiredSession);
  }, [clearSession]);

  const login = async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    const payload = getResponseData(res);

    if (!payload?.token || !payload?.user) {
      throw new Error("Respuesta de login invalida");
    }

    localStorage.setItem("auth_token", payload.token);
    setUser(payload.user);
    setIsAuthenticated(true);
    setSessionMessage("");
  };

  const logout = () => {
    clearSession("");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        sessionMessage,
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
