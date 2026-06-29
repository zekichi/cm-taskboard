import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // El token vive en localStorage para mantener sesión entre recargas.
  const token = localStorage.getItem("auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      localStorage.removeItem("auth_token");
      window.dispatchEvent(new CustomEvent("auth:expired"));
    }

    if (!error.response) {
      error.userMessage =
        "No pudimos conectar con la API. Revisa CORS, Render o tu conexión.";
    }

    return Promise.reject(error);
  }
);
