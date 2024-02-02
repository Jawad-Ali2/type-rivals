const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  console.log("In auth header", authHeader);
  if (!authHeader) {
    return res.status(401).json({ message: "Invalid authorization" });
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secret");
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }

  if (!decodedToken) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  console.log(decodedToken);
  req.userId = decodedToken.userId;
  next();
};
