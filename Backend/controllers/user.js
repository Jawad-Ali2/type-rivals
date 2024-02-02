const User = require("../models/user");

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
