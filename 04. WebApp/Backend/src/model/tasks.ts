import createHttpError from "http-errors";
import pool from "../database/sqldb";
import { ResultSetHeader, RowDataPacket } from "mysql2";

interface TaskProps {
  task: string;
  dueDate: string;
  dueTime: string;
  lots: string;
  tag: "Monitoring" | "Fertilizing" | "Memo";
  estateId: number;
  userId: number;
}

class TaskModel {
  static async getTasksByEstate(estateId: number) {
    const query = `
        SELECT taskId, task, dueDate, dueTime, tag, status, lots
        FROM TASKS
        WHERE estateId = ? AND status IN ('Pending', 'InProgress')
        ORDER BY dueDate, dueTime
    `;

    const [rows] = await pool.query<RowDataPacket[]>(query, [estateId]);

    return rows;
  }

  static async addTask({
    task,
    dueDate,
    dueTime,
    tag,
    lots,
    estateId,
    userId,
  }: TaskProps) {
    // Start a transaction to protect everything
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const query = `
        INSERT INTO TASKS (task, dueDate, dueTime, tag, lots, estateId, userId)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [task, dueDate, dueTime, tag, lots, estateId, userId];

      const [results] = await pool.query<ResultSetHeader>(query, values);

      if (results.affectedRows === 0) {
        throw createHttpError(500, "No task added");
      }
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
}

export default TaskModel;
