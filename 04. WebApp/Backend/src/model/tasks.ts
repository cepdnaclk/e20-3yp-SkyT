import createHttpError from "http-errors";
import pool from "../database/sqldb";
import { ResultSetHeader, RowDataPacket } from "mysql2";

interface TaskProps {
  task: string;
  dueDate: string;
  dueTime: string;
  lots: number[];
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

      console.log("Existing Tasks: ", findResults);

      // Loop through existing tasks and check lot overlap
      for (const result of findResults) {
        // Ensure existingLots is a valid array, even if it's null or undefined
        const existingLots: number[] = result.lots || [];

        // Check for overlap between the existing lots and new lots
        const hasOverlap = existingLots.some((lot) => lots.includes(lot));

        if (hasOverlap) {
          throw createHttpError(400, "The task already exists");
        }
      }

      // Authorization: Check if the user has permission to work with the provided lots
      const authQuery = `
        SELECT L.lotId 
        FROM LOTS L
        JOIN EMPLOYEES E ON E.estateId = L.estateId
        WHERE E.employeeId = ? AND E.estateId = ?
      `;
      const [allowedLots] = await conn.query<RowDataPacket[]>(authQuery, [
        userId,
        estateId,
      ]);

      console.log("Allowed lots: ", allowedLots);

      // If no allowed lots, deny access
      if (allowedLots.length === 0) {
        console.log("Permission denied");
        throw createHttpError(403, "Permission denied");
      }

      // Ensure that all provided lots are allowed for the user
      const allowedLotIds = allowedLots.map((lot) => lot.lotId);
      const invalidLots = lots.filter((lot) => !allowedLotIds.includes(lot));

      if (invalidLots.length > 0) {
        throw createHttpError(403, `You don't have permission for some lots`);
      }

      // Insert new task
      const query = `
        INSERT INTO TASKS (task, dueDate, dueTime, tag, lots, estateId, userId)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        task,
        dueDate,
        dueTime,
        tag,
        JSON.stringify(lots), // Ensure the lots are stored as a JSON string
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
          SELECT T.taskId, T.status 
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

      if (authResult[0].staus !== "Pending") {
        console.log("Task is completed or in progress");
        throw createHttpError(400, "Task is completed or in progress");
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
