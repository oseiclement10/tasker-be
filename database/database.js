const dbConfig = require("../config/database.js");
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  ...dbConfig,
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
