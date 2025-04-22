import UserModel from "../../model/users";
import sendResetLinkEmail from "../../service/sendResetLinkEmail";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import env from "../../util/validateEnv";
import AuthModel from "../../model/auth";
import jwt from "jsonwebtoken";

export const createToken: RequestHandler = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      console.log("Email required");
      throw createHttpError(401, "Email required");
    }

    // Find the user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      console.log("Email not found");
      throw createHttpError(404, "Email not found");
    }

    // Generate a reset token (expires in 1 hour)
    const resetToken = jwt.sign(
      { userId: user.userId },
      env.JWT_SECRET,
      { expiresIn: "1h" } // optional: expires in 1 hour
    );

    const resetTokenExpiration = Date.now() + 3600000; // 1 hour

    // Store the token and expiration in the database (make sure to hash it)
    await AuthModel.storeResetToken(
      user.userId,
      resetToken,
      resetTokenExpiration
    );

    // Send the reset email (containing the reset link)
    const resetLink = `${env.FRONTEND_URL}/reset/${resetToken}`;
    await sendResetLinkEmail(email, resetLink);

    console.log("Reset link sent. Expires in 1 hr.");
    res.status(201).json({ message: "Password reset link sent to email." });
  } catch (error) {
    next(error);
  }
};
