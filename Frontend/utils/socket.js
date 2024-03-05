import io from "socket.io-client";

let socket = null;

const createConnection = (token) => {
  if (!socket) {
    socket = io("http://localhost:8000", {
      withCredentials: true,
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return socket;
};

export default createConnection;
