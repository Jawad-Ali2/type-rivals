const User = require("../models/user");
const gtts = require("node-gtts")("en-us");
const path = require("path");
const admin = require("firebase-admin");
// const serviceAccount = require("../config/serviceAccountKey.json");
const serviceAccount = require("../config/serviceAccountKey.js");

const config = require("../config/firebase.config");
const Paragraph = require("../models/paragraphs");

// Initialize firebase config
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: config.firebaseConfig.storageBucket,
});

exports.getUserDashboard = (req, res) => {
  console.log(req.userId);
  User.findById({ _id: req.userId })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.quickRaceTrack = (req, res) => {
  const bucket = admin.storage().bucket();

  Paragraph.aggregate([
    {
      $project: {
        quotesCount: { $size: "$genre.quotes" },
      },
    },
  ])
    .then((result) => {
      const { quotesCount } = result[0];
      const randomValue = Math.floor(Math.random() * quotesCount);

      return Paragraph.aggregate([
        { $unwind: "$genre.quotes" },
        { $skip: randomValue },
        { $limit: 1 },
      ]);
    })
    .then((quotes) => {
      // console.log(quote);
      const quote = quotes[0].genre.quotes;
      const name = quote.text;
      const fileName = name.split(" ").slice(0, 5).join("-").replace(",", "");
      // Upload file
      const file = bucket.file(`speech/${fileName}.mp3`);

      const fileStream = file.createWriteStream({
        metadata: {
          contentType: "audio/mpeg",
        },
      });
      fileStream.on("error", (err) => {
        console.error(err);
        res
          .status(500)
          .send({ message: "Error uploading file to Firebase Cloud Storage" });
      });

      fileStream.on("finish", () => {
        console.log("File uploaded successfully");
        file
          .getSignedUrl({ action: "read", expires: "01-01-2025" })
          .then((url) => {
            res.status(200).send({ content: quote, url: url });
          })
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      });
      gtts.stream(quote.text).pipe(fileStream);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.saveUserStats = (req, res) => {
  const speed = req.body.speed;
  const userId = req.body.userId;

  let currUser;
  let updatedData = {
    races: 0,
    avgSpeed: 0,
    maxSpeed: 0,
  };

  User.findById(userId)
    .then((user) => {
      console.log(user.raceDetail.races);
      user.raceDetail.races += 1;

      user.raceDetail.avgSpeed = Math.round(
        (user.raceDetail.avgSpeed * (user.raceDetail.races - 1) + speed) /
          user.raceDetail.races
      );

      if (speed > user.raceDetail.maxSpeed) user.raceDetail.maxSpeed = speed;
      console.log(
        user.raceDetail.races,
        user.raceDetail.avgSpeed,
        user.raceDetail.maxSpeed
      );
      return user.save();
    })
    .then(() => {
      res.status(200).json({ message: "User stats updated successfully" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
