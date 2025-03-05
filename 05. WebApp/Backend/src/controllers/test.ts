import { RequestHandler } from "express";
import pool from "../database/awsDBConfig";

export const test: RequestHandler = async (req, res, next) => {
  const query = req.body.query;
  console.log("SQL Query: ", query);

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(query);
    connection.release();

    console.log("Test OK", rows);
    res.status(200).json({ result: rows });
  } catch (error) {
    next(error);
  }
};
