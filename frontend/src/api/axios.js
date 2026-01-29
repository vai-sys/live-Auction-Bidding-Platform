import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  headers: { "Content-Type": "application/json" },
});



api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`API ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;
