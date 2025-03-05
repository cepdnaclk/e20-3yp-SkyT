import mysql from "mysql2/promise";
import env from "../util/validateEnv";

const pool = mysql.createPool({
  host: "database-1.cwt8ikeayy80.us-east-1.rds.amazonaws.com", // Remove http://
  user: "admin",
  password: "RDBAWS1234",
  database: "awsdatabase_1",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

export const awsMySQLDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to AWS MySQL!");
    connection.release();
  } catch (error) {
    console.error("Error connecting to AWS MySQL:", error);
    throw error;
  }
};
