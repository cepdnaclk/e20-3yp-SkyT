import UserModel from "../../model/users";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import env from "../../util/validateEnv";
import AuthModel from "../../model/auth";
import jwt from "jsonwebtoken";
import generateOTP from "../../util/generateOTP";
import sendOTPEmail from "../../service/sendOTPEmail";

export const changeEmail: RequestHandler = async (req, res, next) => {
  const { newEmail, userId } = req.body;

  try {
    if (!newEmail) {
      console.log("Email required");
      throw createHttpError(401, "Email required");
    }

    // Find the user by email
    const user = await UserModel.findById(userId);
    if (!user) {
      console.log("User not found");
      throw createHttpError(404, "User not found");
    }

    // Generate a reset token (expires in 30 min)
    const otp = generateOTP(6);
    const resetToken = jwt.sign(
      { userId, otp },
      env.JWT_SECRET,
      { expiresIn: "0.5h" } // optional: expires in 30 min
    );

    const resetTokenExpiration = Date.now() + 1800000; // 30 min

    // Store the token and expiration in the database (make sure to hash it)
    await AuthModel.storeResetToken(userId, resetToken, resetTokenExpiration);

    // Send the OTP email
    await sendOTPEmail(newEmail, otp);

    console.log("Reset link sent. Expires in 30 min.");
    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    next(error);
  }
};
