import pool from "../database/sqldb";
import { RowDataPacket } from "mysql2";

class EstateModel {
  // Get owned estates as a list
  static async getEstateList(userId: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT e.estateId, e.estate 
       FROM ESTATES e 
       INNER JOIN EMPLOYEES u ON e.estateId = u.estateId
       WHERE employeeId = ?`,
      [userId]
    );

    //console.log("Owned Estates: ", rows);

    return rows;
  }

  // Fetch employee details working in manager's estates
  static async getEmployees(managerId: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        u.userId AS id,
        u.fName,
        u.lName,
        u.email,
        u.profilePic AS img,
        u.role,
        JSON_ARRAYAGG(e.estateId) AS estates
      FROM USERS u
      JOIN EMPLOYEES ue ON ue.employeeId = u.userId
      JOIN ESTATES e ON e.estateId = ue.estateId
      WHERE e.managerId = ? AND u.role != 'Developer'
      GROUP BY u.userId`,
      [managerId]
    );

    //console.log("Employees under manager " + managerId + ": ", rows);

    return rows;
  }
}

export default EstateModel;
