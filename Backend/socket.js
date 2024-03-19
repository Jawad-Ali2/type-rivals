const User = require("./models/user");
const { createLobby, joinLobby, fetchQuote, getLobby, updateLobby } = require("./utils/race");

let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: "http://localhost:5173",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true, // enable cookies and credentials
      },
    });

    io.on("connection", (socket) => {
      console.log(socket.id + " connected");

      socket.on("createOrJoinLobby", (playerId) => {
        // Creation or Joining of lobby
        joinLobby(playerId, socket, io).then((lobby) => {
          // console.log(lobby);
          // If lobby has been joined
          if (lobby) {
            // Todo: Change player count to 4
            if (lobby.players.length === 2) {
              console.log("Lobby length: " + lobby.players.length);
              lobby.state = "in-progress";
            }

            // ! Just to check players in room
            io.in(lobby.id)
              .allSockets()
              .then((sockets) => {
                const usersInSession = Array.from(sockets);
                console.log("Users in session:", usersInSession);
              });

            // If the state matches
            if (lobby.state === "in-progress") {
              // Each player in room is sent paragraph
              fetchQuote()
                .then((quote) => {
                  io.in(lobby.id).emit("message", quote, lobby);
                })
                .catch((err) => {
                  console.log(err);
                });
              // cb(lobby);
            }
            // socket.to(`lobby-${lobby.id}`).emit("lobbyUpdate", lobby);
          } else {
            socket.emit(
              "lobbyNotFound",
              "No Available Lobby Found. Please try again later."
            );
          }
        });

        socket.on("typingSpeedUpdate", (wpm, lobby, socketId) => {
          console.log(wpm, lobby, socketId);
          
          if(lobby){
            updateLobby(lobby, socketId, wpm)
          }
          // socket.emit("speed", wpm);
          io.in(lobby).emit("speed", {wpm, socketId})
        });

        socket.on("disconnect", () => {
          console.log("disconnect");
        });
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) throw new Error("Socket io is not initialized");

    return io;
  },
};
