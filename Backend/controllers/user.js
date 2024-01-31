exports.getUserDashboard = (req, res) => {
  res.status(200).send(req.user);
};
