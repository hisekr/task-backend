const jwt = require("jsonwebtoken");

const serverSecretKey = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  // console.log("token error ", req.headers["authorization"]);
  const token = req.headers["authorization"].split(" ")[1];

  // console.log("token", token);

  if (!token) {
    return res.status(401).json({ error: "Access denied. Token is missing" });
  }
  try {
    jwt.verify(token, serverSecretKey);

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = verifyToken;
