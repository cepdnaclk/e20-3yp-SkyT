import pool from "../database/sqldb";
import { RowDataPacket } from "mysql2";

interface DroneProps {
  monAct: number;
  monAva: number;
  ferAct: number;
  ferAva: number;
}

class DroneModel {
  static async getDroneSummary(estateId: number): Promise<DroneProps> {
    const query = `
          SELECT
            SUM(CASE WHEN type = 'Monitoring' AND status = 'Active' THEN 1 ELSE 0 END) AS monAct,
            SUM(CASE WHEN type = 'Monitoring' AND status = 'Available' THEN 1 ELSE 0 END) AS monAva,
            SUM(CASE WHEN type = 'Fertilizing' AND status = 'Active' THEN 1 ELSE 0 END) AS ferAct,
            SUM(CASE WHEN type = 'Fertilizing' AND status = 'Available' THEN 1 ELSE 0 END) AS ferAva
          FROM DRONES
          WHERE estateId = ?
        `;

    const [rows] = await pool.query<RowDataPacket[]>(query, [estateId]);

    return rows[0] as DroneProps;
  }
}

export default DroneModel;
