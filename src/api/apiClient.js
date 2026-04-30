import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000/api", // ← después lo ajustamos si cambia
  headers: {
    "Content-Type": "application/json",
  },
});
