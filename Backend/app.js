const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // enable cookies and credentials
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

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
