const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.postSignUp = (req, res) => {
  const username = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const age = req.body.age;
  // Handle picture submission
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array() });
  }
  console.log(username, email, password, age);

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        name: username,
        email: email,
        password: hashedPassword,
        age: age,
        raceDetail: {},
      });

      return user.save();
    })
    .then(() => {
      res.status(201).json({ message: "User saved successfully" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);
  let loggedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.status(401).json({ message: "User not found" });
      }
      loggedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isMatch) => {
      if (isMatch) {
        const token = jwt.sign(
          {
            email: loggedUser.email,
            userId: loggedUser._id.toString(),
          },
          "secret",
          { expiresIn: "1h" }
        );
        console.log(token);
        res.status(200).json({
          token,
          userId: loggedUser._id.toString(),
        });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.postLogout = (req, res) => {
  res.status(200).send({ message: "Logged out" });
};
