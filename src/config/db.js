const { Pool } = require("pg");
require("dotenv").config();

// PostgreSQL connection configuration
const pool = new Pool();

// Test database connection
// pool.connect((err, client, release) => {
//   if (err) {
//     return console.error("Error acquirung client", err.stack);
//   }
//   client.query("SELECT NOW()", (err, result) => {
//     release();
//     if (err) {
//       return console.error("Error executing query", err.stack);
//     }
//     console.log("Connected to the database:", result.rows);
//   });
// });

const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  //console.log("executed query", { text, duration, rows: res.rowCount });
  return res;
};

module.exports = {
  query,
  pool,
};
