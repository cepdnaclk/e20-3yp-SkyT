import { RequestHandler } from "express";
import pool from "../database/sqldb";
import { RowDataPacket } from "mysql2";

export const testDB: RequestHandler = async (req, res, next) => {
  try {
    const testQuery = "SELECT * FROM USERS";
    const [rows] = await pool.query<RowDataPacket[]>(testQuery);
    console.log(rows);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Database test query failed:", err);
    next(err);
  }
};
