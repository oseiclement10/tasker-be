const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  queueLimit: 0,
  connectionLimit: 10,
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    console.log("connected to database successfully");
    return;
  } catch (err) {
    console.log("error connecting to database", err);
    return;
  }
};

module.exports = {
  pool,
};
