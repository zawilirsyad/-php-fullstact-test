const { pool } = require("pg");
const { connectionString } = require("pg/lib/defaults");
require("./db_sql.env").config();

const pool = new Pool({
  connectionString: process_params.env.DATABASE_URL,
});

module.exports = pool;
