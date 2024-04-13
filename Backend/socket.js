const {
  joinLobby,
  fetchQuote,
  updateLobby,
  disconnectUser,
  switchLobbyState,
} = require("./utils/race");
const { Mutex } = require("async-mutex");

const createOrJoinLobbyMutex = new Mutex();
const deleteMutex = new Mutex();
const userLastRequestMap = new Map();

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

      socket.on(
        "createOrJoinLobby",
        async (
          playerId,
          noOfPlayers,
          isFriendlyMatch,
          isFriendlyLobbyCreator,
          friendLobbyID
        ) => {
          const release = await createOrJoinLobbyMutex.acquire();

          try {
            // Creation or Joining of lobby
            // TODO: I can pass socket to join and join function can send emit whenever a user joins
            const lobby = await joinLobby(
              playerId,
              socket,
              noOfPlayers,
              isFriendlyMatch,
              isFriendlyLobbyCreator,
              friendLobbyID
            );
            // If lobby has been joined
            if (!lobby) {
              console.log("Some error occured");
              socket.emit(
                "error",
                "Something unexpected happened, Please try again!"
              );
              return;
            }

            if (lobby) {
              // * Whenever we reach here that means the user has joined the lobby
              // TODO: I can emit signal in lobby that will create effect of people joining one by one
              io.in(lobby.id).emit("playerJoined", lobby);

              // * If the lobby is of friendly match type
              if (lobby.lobbyCode) {
                io.in(lobby.id).emit("generatedLobbyCode", lobby.lobbyCode);
              }
              // console.log("Request proceeded");
              if (lobby.players.length == noOfPlayers) {
                console.log("Lobby length: " + lobby.players.length);
                lobby.state = "in-progress";
                await switchLobbyState("in-progress", lobby._id);
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
                const quote = await fetchQuote();

                io.in(lobby.id).emit("message", quote, lobby);
              }
            } else {
              socket.emit(
                "error",
                "No Available Lobby Found. Please try again later."
              );
            }
          } finally {
            release();
          }

          socket.on(
            "typingSpeedUpdate",
            (wpm, percentage, lobby, socketId, raceTime, raceDuration) => {
              if (lobby) {
                // If given conditions are met we get raceFinished as true
                updateLobby(
                  lobby,
                  socketId,
                  wpm,
                  percentage,
                  raceTime,
                  raceDuration
                )
                  .then((raceFinished1) => {
                    if (raceFinished1) {
                      // io.in(lobby).emit("raceFinished", raceFinished1);
                      // TODO: If all users in game recieve signal uncomment and remove this line
                      io.emit("raceFinished", raceFinished1);
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    socket.emit(
                      "error",
                      "Something went wrong, Please try again!"
                    );
                  });
              }
              io.in(lobby).emit("speed", { wpm, percentage, socketId });
            }
          );

          socket.on("leaveRace", async (socketid) => {
            const release = await deleteMutex.acquire();
            const currentTime = Date.now();
            const lastRequestTime = userLastRequestMap.get(socketid);

            if (lastRequestTime && currentTime - lastRequestTime < 1000) {
              return;
            }

            userLastRequestMap.set(socketid, currentTime);

            try {
              console.log("leaveRace", socketid);
              await disconnectUser(socketid);
            } finally {
              release();
            }
          });

          socket.on("disconnect", () => {
            console.log("disconnect");
          });
        }
      );
    });

    return io;
  },
  getIO: () => {
    if (!io) throw new Error("Socket io is not initialized");

    return io;
  },
};
