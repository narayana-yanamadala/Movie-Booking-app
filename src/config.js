export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://cinerush-backend.onrender.com"
    : "http://127.0.0.1:8000";