import axios from "axios";

export const apiRoutes = {
  serverUrl: import.meta.env.VITE_SERVER_URL || "http://localhost:5000",
  sessions: {
    create: "/api/session/create",
  },
};

export const axiosInstance = axios.create({
  baseURL: apiRoutes.serverUrl,
});
