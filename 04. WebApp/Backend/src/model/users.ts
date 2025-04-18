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
}

export interface UpdateUser extends Omit<NewUser, "password"> {
  userId: number;
  profilePic: string | null;
}

interface MysqlError extends Error {
  code: string;
  errno: number;
}

// Create a User class that will handle database interactions
class UserModel {
  // Create a new user
  static async create(user: NewUser) {
    const { email, password, role, fName, lName } = user;

    try {
      // Hash the password
      const hashedPassword = await argon2.hash(password);

      // Insert new user into the database
      const result = await pool.query<ResultSetHeader>(
        "INSERT INTO USERS (email, password, role, fName, lName) VALUES (?, ?, ?, ?, ?)",
        [email, hashedPassword, role || "Maintain", fName, lName || ""]
      );

      return result[0].insertId; // Return the new user's ID
    } catch (error: unknown) {
      if (error instanceof Error && (error as MysqlError).code) {
        const mysqlError = error as MysqlError;
        if (mysqlError.code === "ER_DUP_ENTRY" || mysqlError.errno === 1062) {
          console.log("User with this email already exists");
          throw createHttpError(400, "User with this email already exists");
        }
      }
      throw error;
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

  // Reset user password
  static async resetPassword(email: string, newPassword: string) {
    // Check if user exists
    const user = await this.findByEmail(email);
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    // Hash the new password
    const hashedPassword = await argon2.hash(newPassword);

    // Update the user's password in the database
    const result = await pool.query<ResultSetHeader>(
      "UPDATE USERS SET password = ? WHERE email = ?",
      [hashedPassword, email]
    );

    return result[0]; // Return the result of the password reset operation
  }
}

export default UserModel;
