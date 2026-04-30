import { Navigate, Outlet } from "react-router-dom";

// Ruta protegida simple basada en un token guardado en localStorage
export default function ProtectedRoute() {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
