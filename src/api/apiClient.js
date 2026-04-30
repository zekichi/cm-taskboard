import axios from "axios";

// Cliente API propio para comunicar el frontend con el backend
export const api = axios.create({
  baseURL: "http://localhost:4000/api", // Cambiar si usás otro puerto
  headers: {
    "Content-Type": "application/json",
  },
});
