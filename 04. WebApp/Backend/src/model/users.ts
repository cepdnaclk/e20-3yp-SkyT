import pool from "../database/sqldb";
import createHttpError from "http-errors";
import argon2 from "argon2";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// Define the User interface for type checking
export interface NewUser {
  email: string;
  password: string;
  role: string;
  fName: string;
  lName?: string;
  estates: number[];
}

export interface UpdateUser extends Omit<NewUser, "password"> {
  userId: number;
  profilePic: string | null;
}

// Create a User class that will handle database interactions
class UserModel {
  // Create a new user
  static async create(user: NewUser) {
    const connection = await pool.getConnection();

    try {
      const { email, password, role, fName, lName, estates } = user;

      // Start transaction
      await connection.beginTransaction();

      // Check for existing email
      const [existing] = await connection.query<RowDataPacket[]>(
        "SELECT userId FROM USERS WHERE email = ?",
        [email]
      );
      if (existing.length > 0) {
        throw createHttpError(400, "User with this email already exists");
      }

      // Hash the password
      const hashedPassword = await argon2.hash(password);

      // Insert new user into the database
      const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO USERS (email, password, role, fName, lName) VALUES (?, ?, ?, ?, ?)",
        [email, hashedPassword, role || "Assistant", fName, lName || ""]
      );

      const userId = result.insertId;

      // Insert estates
      const values = estates.map((estateId) => [userId, estateId]);
      const [rows] = await connection.query<ResultSetHeader>(
        `INSERT INTO EMPLOYEES (employeeId, estateId) VALUES ?`,
        [values]
      );

      if (rows.affectedRows === 0) {
        throw createHttpError(500, "No employees added");
      }

      await connection.commit();
      return userId;
    } catch (error: unknown) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get a user by email
  static async findByEmail(email: string) {
    const result = await pool.query<RowDataPacket[]>(
      "SELECT * FROM USERS WHERE email = ?",
      [email]
    );
    return result[0][0]; // Return the user
  }

  // Get a user by userId
  static async findById(userId: number | string) {
    const result = await pool.query<RowDataPacket[]>(
      "SELECT * FROM USERS WHERE userId = ?",
      [userId]
    );
    return result[0][0]; // Return the user
  }

  // Get all system users for the developer
  static async getUsers() {
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
      JOIN EMPLOYEES e ON e.employeeId = u.userId
      GROUP BY u.userId`
    );

    //console.log("Users in the system managed by developers: ", rows);

    return rows;
  }

  // Update user details
  static async update(user: UpdateUser) {
    // Extract the userId from the passed 'user' object
    const { userId, profilePic, ...updates } = user;

    // Dynamically build the SET clause based on the fields provided in 'updates'
    let fields = Object.keys(updates)
      .map((field) => `${field} = ?`)
      .join(", ");

    // Values to be updated
    const values = Object.values(updates);

    // If a profilePic is provided, add it to the SET clause
    if (profilePic !== null) {
      fields += `, profilePic = ?`; // Add profilePic to the SET clause
      values.push(profilePic); // Add profilePic to the values
    }

    // Execute the query
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE USERS SET ${fields} WHERE userId = ?`,
      [...values, userId] // Add userId at the end to use in WHERE clause
    );

    return result; // Return the result of the update
  }
}

export default UserModel;
