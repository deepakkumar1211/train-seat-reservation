require("dotenv").config(); // Load environment variables from .env file
const { Pool } = require("pg"); // PostgreSQL client

// Create a PostgreSQL connection pool using environment variables
const pool = new Pool({
  user: process.env.DB_USER,       // DB username
  password: process.env.DB_PASSWORD, // DB password
  host: process.env.DB_HOST,       // DB host
  port: process.env.DB_PORT,       // DB port
  database: process.env.DB_NAME,   // DB name
});

// Function to test and confirm DB connection
const connectDB = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("PostgreSQL connected");
  } catch (err) {
    console.error("Database connection error", err);
  }
};

module.exports = connectDB; 
module.exports.pool = pool;
