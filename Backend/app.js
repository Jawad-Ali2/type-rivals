const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { doubleCsrf } = require("csrf-csrf");

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

const app = express();

const {
  invalidCsrfTokenError,
  generateToken,
  doubleCsrfProtection,
  validateRequest,
} = doubleCsrf({
  getSecret: () => "Super secret",
  cookieName: "X-Csrf-Token",
  cookieOptions: { secure: false, signed: true, sameSite: false },
  getTokenFromRequest: (req) => req.headers["x-csrf-token"],
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // enable cookies and credentials
  })
);

app.use(cookieParser("Super secret"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(doubleCsrfProtection);
app.get("/csrf-token", (req, res) => {
  const csrfToken = generateToken(req, res);

  res.json({ csrfToken });
});

const errorHandler = (err, req, res, next) => {
  if (err === invalidCsrfTokenError) {
    res.status(403).json({
      message: "Invalid CSRF Token",
    });
  } else {
    next();
  }
};

app.use("/auth", errorHandler, authRoutes);
app.use("/user", errorHandler, userRoutes);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@type-rivals.uhhezl0.mongodb.net/db`
  )
  .then(() => {
    console.log("Database Connected");
    const server = app.listen(8000, () => {
      console.log("Server listening ");
    });
    const io = require("./socket").init(server);
    // TODO: Make a class for waiting queues
    const waitingPlayers = [];

    // * When the user first connects
    io.on("connection", (socket) => {
      console.log("a user connected");

      // * On receiving the signal join the race queue
      socket.on("joinRace", ({ userId }, callback) => {
        waitingPlayers.push({ socketId: socket.id, userId });
        console.log(waitingPlayers);

        // ! Currently players limit is 2 (Increase it to 4 in future)
        if (waitingPlayers.length >= 2) {
          const playersToStart = waitingPlayers.splice(0, 2);
          // * Generate session id
          //const sessionName = `session-${crypto.randomUUID().toString()}`;

          // * Send session join request to each selected player
          playersToStart.forEach((player) => {
            io.to(player.socketId).emit("session", sessionName);
          });

          // * When required players has joined the session game will start
          callback(playersToStart);
        }

        console.log(waitingPlayers);
        console.log(`${userId} connected`);
      });

      socket.on("joinSession", (sessionName) => {
        console.log("sessions joined", sessionName);
        socket.join(sessionName);

        // ! Remove in future
        io.in(sessionName)
          .allSockets()
          .then((sockets) => {
            const usersInSession = Array.from(sockets);
            console.log("Users in session:", usersInSession);
          });
      });

      socket.on("leaveSession", (currentSession) => {
        // ! Remove in future
        const peeps = io.sockets.adapter.rooms.get(currentSession);

        console.log(peeps);
        socket.leave(currentSession);
        console.log(peeps);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");

        // * If user is in the queue and leaves before game starts, remove him from queue
        const index = waitingPlayers.findIndex(
          (player) => player.socket === socket
        );
        if (index !== -1) {
          waitingPlayers.splice(index, 1);
        }
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
