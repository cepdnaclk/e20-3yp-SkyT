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
        WHERE estateId = ? AND status != 'Completed'
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

      const findQuery = `
        SELECT taskId, lots 
        FROM TASKS 
        WHERE dueDate = ? 
          AND dueTime = ? 
          AND tag = ? 
          AND estateId = ?
      `;
      const params = [dueDate, dueTime, tag, estateId];

      const [findResults] = await conn.query<RowDataPacket[]>(
        findQuery,
        params
      );

      console.log("Exist Tasks: ", findResults);

      // Loop through existing tasks and check lot overlap
      for (const result of findResults) {
        const existingLots: string[] = result.lots || [];

        const hasOverlap = existingLots.some((lot) => lots.includes(lot));

        if (hasOverlap) {
          throw createHttpError(400, "The task already exists");
        }
      }

      const query = `
        INSERT INTO TASKS (task, dueDate, dueTime, tag, lots, estateId, userId)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        task,
        dueDate,
        dueTime,
        tag,
        JSON.stringify(lots),
        estateId,
        userId,
      ];

      const [results] = await conn.query<ResultSetHeader>(query, values);

      if (results.affectedRows === 0) {
        throw createHttpError(500, "No task added");
      }

      // Commit the transaction
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  static async removeTask(userId: number, taskId: number) {
    // Start a transaction to protect everything
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const authQuery = `
          SELECT T.taskId 
          FROM TASKS T
          JOIN EMPLOYEES E ON E.estateId = T.estateId
          WHERE E.employeeId = ? AND T.taskId = ?
        `;

      const [authResult] = await conn.query<RowDataPacket[]>(authQuery, [
        userId,
        taskId,
      ]);

      if (authResult.length === 0) {
        console.log("Access denied");
        throw createHttpError(403, "Access denied");
      }

      const rmQuery = `DELETE FROM TASKS WHERE taskId = ?`;

      const [rmResults] = await conn.query<ResultSetHeader>(rmQuery, [taskId]);

      if (rmResults.affectedRows === 0) {
        console.log("Failed to remove task");
        throw createHttpError(400, "Failed to remove task");
      }

      await conn.commit();
      return { message: "Task removed successfully" };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
}

export default TaskModel;
