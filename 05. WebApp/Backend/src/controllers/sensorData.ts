import { RequestHandler, Response } from "express";
import pool from "../database/awsDBConfig";

export const getData: RequestHandler = async (req, res, next) => {
  try {
    const query = `
        SELECT id, node_id, time, ph_lvl, nitrogen_lvl, posporus_lvl, pottasuim_lvl, humidity, temperature 
        FROM sensor_Data
        ORDER BY time DESC
        LIMIT 1;
    `;

    const connection = await pool.getConnection();
    const [rows]: any[] = await connection.query(query);
    connection.release(); // Release connection immediately after query

    if (rows.length === 0) {
      return res.status(404).json({ message: "No sensor data found" });
    }

    const reqData = rows[0];

    const dataObj = [
      { value: `${reqData.temperature} °C` },
      { value: `${reqData.humidity}%` },
      { value: `${reqData.ph_lvl}` },
      { value: `${reqData.nitrogen_lvl} mg/kg` },
      { value: `${reqData.posporus_lvl} mg/kg` },
      { value: `${reqData.pottasuim_lvl} mg/kg` },
    ];

    console.log("Sensor readings retrieved successfully!", dataObj);
    res.status(200).json(dataObj);
  } catch (error) {
    next(error);
  }
};

export const deleteData: RequestHandler = async (req, res, next) => {
  try {
    // Destructuring object
    const id = req.body._id;
    //console.log(`Delete Event id: ${id}`);

    console.log("Event deleted successfully!");
    res.status(200).json("success");
  } catch (error) {
    next(error);
  }
};
