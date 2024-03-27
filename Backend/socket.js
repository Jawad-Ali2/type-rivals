const {
  joinLobby,
  fetchQuote,
  updateLobby,
  disconnectUser,
  switchLobbyState,
} = require("./utils/race");

const corsOrigin =
  process.env.NODE_ENV === "production"
    ? process.env.CORS_ORIGIN
    : "http://localhost:5173";
const cookiesOptions = {
  secure: process.env.NODE_ENV === "production" ? true : false,
  signed: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : false,
};

let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: corsOrigin,
        methods: ["GET", "POST"],
        credentials: true,
      },
      cookie: cookiesOptions,
    });

    io.on("connection", (socket) => {
      console.log(socket.id + " connected");

      socket.on("createOrJoinLobby", (playerId) => {
        // Creation or Joining of lobby
        joinLobby(playerId, socket, io).then((lobby) => {
          // If lobby has been joined
          if (lobby) {
            // Todo: Change player count to 4
            if (lobby.players.length === 2) {
              console.log("Lobby length: " + lobby.players.length);
              lobby.state = "in-progress";
              switchLobbyState("in-progress", lobby._id);
            }
            // ! Just to check players in room
            io.in(lobby._id.toString())
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
                  console.log("Quote sent:", quote);
                  io.in(lobby._id.toString()).emit("message", quote, lobby);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          } else {
            socket.emit(
              "lobbyNotFound",
              "No Available Lobby Found. Please try again later."
            );
          }
        });

        socket.on("typingSpeedUpdate", (wpm, percentage, lobby, socketId) => {
          console.log(lobby);
          if (lobby) {
            updateLobby(lobby, socketId, wpm, percentage);
          }
          io.in(lobby).emit("speed", { wpm, percentage, socketId });
        });

        socket.on("leaveRace", () => {
          console.log("leaveRace");
          disconnectUser(socket.id);
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
