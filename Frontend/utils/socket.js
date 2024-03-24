import { backendUrl } from "../config/config";
import io from "socket.io-client";

let socket = null;

const createConnection = (token) => {
  if (!socket) {
    socket = io(`${backendUrl}`, {
      secure: true,
      withCredentials: true,
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return socket;
};

export default createConnection;
