import "dotenv/config";
import env from "../util/validateEnv";
import { ConnectionPool } from "mssql";

const config = {
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  server: env.DB_SERVER,
  database: env.DB_NAME,
  port: env.DB_PORT,
  options: {
    encrypt: env.DB_ENCRYPT,
    enableArithAbort: env.DB_TRUST_SERVER_CERTIFICATE,
  },
};

let pool: ConnectionPool | null = null;

export const azureDB = async (): Promise<ConnectionPool> => {
  try {
    if (!pool) {
      pool = await new ConnectionPool(config).connect();
      console.log("Connected to Azure SQL Database");
    }
    return pool;
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
};
