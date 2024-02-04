const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Invalid authorization" });
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secret");

    if (!decodedToken) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};
