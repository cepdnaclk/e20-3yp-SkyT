import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../../model/users";
import argon2 from "argon2";
import AuthModel from "../../model/auth";
import jwt from "jsonwebtoken";
import env from "../../util/validateEnv";

const allowedRoles = ["Owner", "Developer", "Assistant"];

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    console.log("Updating user: ", req.body);

    const { curPwd, newPwd, emailCode } = req.body;
    const { userId, email, role, fName, lName, profilePic } = req.body.userInfo;

    if (!userId || !fName || !email || !allowedRoles.includes(role)) {
      throw createHttpError(400, "Missing required fields");
    }

    console.log("Profile Picture: ", profilePic);

    // Find old user
    const user = await UserModel.findById(userId);
    console.log("User: ", user);
    if (!user) {
      throw next(createHttpError(404, "User not found"));
    }

    // Password Verification
    let password = null;
    if (curPwd && newPwd) {
      const passwordMatch = await argon2.verify(user.password, curPwd);

      if (!passwordMatch) {
        throw next(createHttpError(401, "Invalid password"));
      }

      password = newPwd;
    }

    // Email Verification
    let newEmail = user.email;
    if (user.email !== email && !isNaN(parseInt(emailCode))) {
      console.log("Email has changed");

      const tokenData = await AuthModel.findByUser(userId);
      if (!tokenData || tokenData.resetTokenExpiration < Date.now()) {
        throw createHttpError(400, "Invalid or expired OTP.");
      }

      const decoded = jwt.verify(tokenData.resetToken, env.JWT_SECRET) as {
        userId: string | number;
        otp: string | number;
      };

      if (String(emailCode) === String(decoded.otp)) {
        newEmail = email;
      } else {
        throw createHttpError(401, "Invalid OTP");
      }
    }

    // Update user
    const result = await UserModel.update({
      userId,
      email: newEmail,
      password,
      role,
      fName,
      lName,
      profilePic: null,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
