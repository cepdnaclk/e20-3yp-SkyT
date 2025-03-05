import "dotenv/config";
import env from "../util/validateEnv";
import { createPool, Pool } from "mysql2/promise";
import { port } from "envalid";

const config = {
  host: env.AWS_HOST, // MySQL server endpoint
  user: env.AWS_USER, // MySQL username
  password: env.AWS_USER, // MySQL password
  database: env.AWS_DBAS, // MySQL database name
  port: env.AWS_PORT,
  waitForConnections: true, // To allow waiting for free connections in the pool
  connectionLimit: 10, // Maximum number of connections to use in the pool
  queueLimit: 0, // No limit on waiting queries in the pool
};

let pool: Pool | null = null;

export const awsMySQLDB = async (): Promise<Pool> => {
  try {
    if (!pool) {
      pool = createPool(config); // Create and connect to the pool
      console.log("Connected to AWS MySQL Database");
    }
    return pool;
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
};
