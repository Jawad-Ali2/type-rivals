const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { doubleCsrf } = require("csrf-csrf");

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

// Production settings
const PORT = process.env.PORT || 8000;
const corsOrigin =
  process.env.NODE_ENV === "production"
    ? process.env.CORS_ORIGIN
    : "http://localhost:5173";

const cookiesOptions = {
  secure: process.env.NODE_ENV === "production" ? true : false,
  signed: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : false,
};
const app = express();

const {
  invalidCsrfTokenError,
  generateToken,
  doubleCsrfProtection,
  validateRequest,
} = doubleCsrf({
  getSecret: () => "Super secret",
  cookieName: "X-Csrf-Token",
  cookieOptions: cookiesOptions,
  getTokenFromRequest: (req) => req.headers["x-csrf-token"],
});

app.use(
  cors({
    origin: [corsOrigin],
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

app.get("/", (req, res) => {
  console.log(req);
  return res.status(234).send("This page is Routed");
});

app.use("/auth", errorHandler, authRoutes);
app.use("/user", errorHandler, userRoutes);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@type-rivals.uhhezl0.mongodb.net/db`
  )
  .then(() => {
    console.log("Database Connected");
    const server = app.listen(PORT, () => {
      console.log("Server listening ");
    });
    require("./socket").init(server);
  })
  .catch((err) => {
    console.log(err);
  });
