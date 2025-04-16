import mysql, { PoolOptions } from "mysql2/promise";
import env from "../util/validateEnv";

const access: PoolOptions = {
  host: env.DB_HOST,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(access);

export default pool;
