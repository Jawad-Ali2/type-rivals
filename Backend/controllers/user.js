const User = require("../models/user");
const gtts = require("node-gtts")("en-us");
const path = require("path");
// const { getStorage } = require("firebase/storage");
const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey.json");

const { webScrape } = require("../utils/scrape");
const config = require("../config/firebase.config");

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
  const url = "https://www.azquotes.com/top_quotes.html";
  webScrape(url)
    .then((content) => {
      console.log("in");
      const random = Math.floor(Math.random() * 100);
      // Gets the first five words for the file name
      const fileName = content[random].text
        .split(" ")
        .slice(0, 5)
        .join("-")
        .replace(",", "");
      console.log(fileName);

      const bucket = admin.storage().bucket();

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
            res.status(200).send({ content: content[random], url: url });
          })
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      });
      gtts.stream(content[random].text).pipe(fileStream);
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};
