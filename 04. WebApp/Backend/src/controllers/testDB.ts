import { RequestHandler } from "express";
import pool from "../database/sqldb";

export const testDB: RequestHandler = async (req, res, next) => {
  try {
    const testQuery = "SHOW TABLES;";
    const [result] = await pool.query(testQuery);
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
