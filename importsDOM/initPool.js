import pg from "pg";

const { Pool } = pg;
const pgConnectionConfigs = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

const pool = new Pool(pgConnectionConfigs);

export default pool;
