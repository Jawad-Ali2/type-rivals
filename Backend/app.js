const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

const User = require("./models/user");

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
app.use((req, res, next) => {
  User.findById({ _id: "65b8efc66fcd404c6433b7f8" }).then((user) => {
    req.user = user;
    next();
  });
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@type-rivals.uhhezl0.mongodb.net/db`
  )
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        // Creating dummy user for testing purposes
        const user = new User({
          name: "Jawad",
          email: "test@example.com",
          password: 123,
          age: 20,
          raceDetail: [
            {
              wins: 100,
              loses: 20,
              avgSpeed: 79,
              maxSpeed: 92,
            },
          ],
        });

        user.save();
      }
    });
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
