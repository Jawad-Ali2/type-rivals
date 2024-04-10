const {
  joinLobby,
  fetchQuote,
  updateLobby,
  disconnectUser,
  switchLobbyState,
  checkIsValidLobbyCode,
} = require("./utils/race");
const { Mutex } = require("async-mutex");

const deleteMutex = new Mutex();
const createOrJoinLobbyMutex = new Mutex();
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
          // const currentTime = Date.now();
          // const lastRequestTime = userLastRequestMap.get(socket.id);

          // if (lastRequestTime && currentTime - lastRequestTime < 10) {
          //   console.log("Request cancelled in createOrJoin", socket.id);
          //   return;
          // }

          // console.log("Request accepted in createOrJoin", socket.id);
          // userLastRequestMap.set(socket.id, currentTime);

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
            if (lobby) {
              console.log("Request proceeded");
              if (lobby.players.length == noOfPlayers) {
                console.log("Lobby length: " + lobby.players.length);
                lobby.state = "in-progress";
                await switchLobbyState("in-progress", lobby._id);
              }
              console.log(lobby.state);
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
                const quote = await fetchQuote();

                io.in(lobby._id.toString()).emit("message", quote, lobby);
              }
            } else {
              socket.emit(
                "lobbyNotFound",
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
                  });
              }
              io.in(lobby).emit("speed", { wpm, percentage, socketId });
            }
          );

          socket.on("leaveRace", async (socketid) => {
            console.log("LEAVE RACE CALLED");
            const release = await deleteMutex.acquire();
            const currentTime = Date.now();
            const lastRequestTime = userLastRequestMap.get(socketid);

            if (lastRequestTime && currentTime - lastRequestTime < 1000) {
              console.log("Request cancelled", socketid);
              return;
            }

            console.log("checking", socketid);
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
