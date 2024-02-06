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
    app.listen(8000, () => {
      console.log(
        `Backend is listening on ${process.env.HOSTNAME}${process.env.PORT}`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
