const User = require("../models/user");
const bcrypt = require("bcryptjs");
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
  console.log(username, email, password, confirmPassword, age);

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
    .then((result) => {
      res.status(201).json({ message: "User saved successfully" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (isMatch) {
              res.status(200).json({
                message: "User logged in successfully",
                user: user,
              });
            } else {
              res.status(400).json({ message: "Invalid password" });
            }
          })
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      } else {
        res.status(400).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
