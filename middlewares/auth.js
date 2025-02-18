const jwt = require("jsonwebtoken");
const DB = require("../database/database");

const authMiddleware = async (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
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

  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user_id = decoded.user_id;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthenticated",
      error: err.message,
    });
  }

};

module.exports = authMiddleware;
