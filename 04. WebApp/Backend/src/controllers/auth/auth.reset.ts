import { RequestHandler } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import env from "../../util/validateEnv";
import AuthModel from "../../model/auth";

export const resetPassword: RequestHandler = async (req, res, next) => {
  const { token, newPassword } = req.body;
  try {
    if (!token || !newPassword) {
      console.log("token and password required!");
      throw createHttpError(404, "Token and password required!");
    }

    // Decode the token
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      userId: string | number;
    };
    const userId = decoded.userId;

    // Find the reset token in the database
    const tokenData = await AuthModel.findByUser(userId);
    if (!tokenData || tokenData.resetTokenExpiration < Date.now()) {
      throw createHttpError(400, "Invalid or expired reset token.");
    }

    // Update the password in the USERS table
    await AuthModel.updatePassword(tokenData.userId, newPassword);

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    next(error);
  }
};
