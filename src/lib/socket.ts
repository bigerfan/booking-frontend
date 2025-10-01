// socket.ts
import { io } from "socket.io-client";

export const socket = io(
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000",
  {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  }
);
