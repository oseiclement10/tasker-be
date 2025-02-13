const jwt = require("jsonwebtoken");
const DB = require("../database/database");

const authMiddleware = async (req, res, next) => {
  const token = req.headers?.authorization?.split("T")[1];
  if (!token) {
    return res.status(401).json({
      message: "Unauthenticated",
    });
  }
  const [rows] = await DB.query(
    "SELECT id from blacklisted_tokens where token = ?",
    [token]
  );

  if (rows.length) {
    return res.status(401).json({
      message: "Unauthenticated",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, function (err) {
    if (err) {
      return res.status(401).json({
        message: "Unauthenticated",
      });
    }
    next();
  });
};

module.exports = authMiddleware;
