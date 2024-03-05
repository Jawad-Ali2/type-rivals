const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const fs = require("fs");
const { validationResult } = require("express-validator");

exports.postSignUp = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const profilePicture = req.file;

  // Handle picture submission
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array() });
  }

  if (password != confirmPassword) throw new Error("Passwords do not match");

  const bucket = admin.storage().bucket();

  const storagePath = `userProfilePicture/${profilePicture.filename}`;

  const file = bucket.file(storagePath);

  const fileStream = file.createWriteStream({
    metadata: {
      contentType: profilePicture.mimeType,
    },
  });

  fs.createReadStream(profilePicture.path).pipe(fileStream);

  let downloadUrl;
  await new Promise((resolve, reject) => {
    fileStream.on("finish", async () => {
      downloadUrl = await file.getSignedUrl({
        action: "read",
        expires: "01-01-2026",
      });
      resolve();
    });
    fileStream.on("error", reject);
  });
  fs.unlinkSync(profilePicture.path);

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        profilePic: downloadUrl[0],
        name: name,
        email: email,
        password: hashedPassword,
        raceDetail: {
          wins: 0,
          loses: 0,
          avgSpeed: 0,
          maxSpeed: 0,
          races: 0,
        },
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
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  let loggedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return Promise.reject({ status: 404, message: "User not found" });
      }
      console.log("here");
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
      const statusCode = err.status || 500;
      res.status(statusCode).send({ message: err.message });
    });
};

exports.postLogout = (req, res) => {
  // console.log(req.headers.cookie);
  res.clearCookie("X-Csrf-Token");

  res.status(200).send({ message: "Logged out" });
};
