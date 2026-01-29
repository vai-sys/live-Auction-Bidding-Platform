

import { io } from "socket.io-client";

let clientId = localStorage.getItem("clientId");
if (!clientId) {
  clientId = crypto.randomUUID();
  localStorage.setItem("clientId", clientId);
}

export const socket = io(import.meta.env.VITE_BACKEND_URL, {
  auth: { clientId },
  transports: ["websocket"], 
});





export { clientId };
