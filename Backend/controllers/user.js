const User = require("../models/user");

const { webScrape } = require("../utils/scrape");

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
  try {
    const url =
      // "https://www.sciencedirect.com/science/article/pii/S2090123221001491";
      // "https://www.sciencedirect.com/science/article/pii/S0960982214003145";
      "https://www.azquotes.com/top_quotes.html";
    webScrape(url).then((content) => {
      console.log("in");
      const random = Math.floor(Math.random() * 100);
      console.log(content[random]);

      res.status(200).send({ content: content[random] });
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
