const Joi = require("joi");
const DB = require("../database/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const signIn = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(4),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details.map((err) => err.message),
    });
  }

  const { password, email } = req.body;

  try {
    const [rows] = await DB.query("SELECT * FROM users where email = ? ", [
      email,
    ]);

    const user = rows[0];
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const payLoad = {
      user_id: user.id,
      firstname: user.firstname,
      email: user.email,
    };

    const access_token = jwt.sign(payLoad, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      access_token,
      user: { ...payLoad, othernames: user?.othernames },
    });
  } catch (err) {
    return res.status(500).json({
      mesage: "Server error",
      error: err.message,
    });
  }
};

const signUp = async (req, res) => {
  const schema = Joi.object({
    firstname: Joi.string().min(2).required(),
    othernames: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(6)
      .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{6,}$")),
    repeat_password: Joi.ref("password"),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: error.details.map((err) => err.message),
    });
  }

  const { firstname, othernames, email, password } = req.body;

  try {
    const [existingUser] = await DB.query(
      "SELECT id from users where email = ?",
      [email]
    );

    if (existingUser?.length) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await DB.query(
      "INSERT INTO users(firstname,othernames,email,password) values (?,?,?,?)",
      [firstname, othernames, email, hashedPassword]
    );

    return res.status(201).json({
      id: result?.insertId,
      firstname,
      othernames,
      email,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Database error",
      error: err.message,
    });
  }
};

const logOut = async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  const decoded = jwt.decode(token);

  const expiresAt = new Date(decoded.exp * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  try {
    await DB.query(
      "INSERT into blacklisted_tokens(token,expires_at) values(?,?)",
      [token, expiresAt]
    );

    return res.json({
      message: "User logged out successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Database error",
      error: err.message,
    });
  }
};

module.exports = {
  signUp,
  signIn,
  logOut,
};
