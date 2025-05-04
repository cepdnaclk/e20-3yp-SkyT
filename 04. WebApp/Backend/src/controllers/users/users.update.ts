import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../../model/users";
import argon2 from "argon2";
import AuthModel from "../../model/auth";
import jwt from "jsonwebtoken";
import env from "../../util/validateEnv";
import fs from "fs";
import path from "path";

const allowedRoles = ["Owner", "Developer", "Assistant"];

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    console.log("Updating user: ", req.body);

    // Destructuring fields
    const { file } = req;
    const { curPwd, newPwd, emailCode } = req.body;

    console.log("Type of userInfo: ", typeof req.body.userInfo);

    const { userId, email, role, fName, lName, profilePic } = JSON.parse(
      req.body.userInfo
    );

    if (isNaN(userId) || !fName || !email || !allowedRoles.includes(role)) {
      throw createHttpError(400, "Missing required fields");
    }

    console.log("Profile Picture: ", profilePic);

    // Find user
    const user = await UserModel.findById(userId);
    console.log("User: ", user);
    if (!user) throw next(createHttpError(404, "User not found"));

    // Password Verification
    let password = null;
    if (curPwd && newPwd) {
      const passwordMatch = await argon2.verify(user.password, curPwd);
      if (!passwordMatch) throw next(createHttpError(401, "Invalid password"));
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

    // Handle image file upload
    let imageUrl: string | null = user.profilePic || null;
    if (file) {
      const ext = path.extname(file.originalname);
      const newFilename = `user_${userId}${ext}`;
      const savePath = path.join(`${env.IMAGE_DIR}/users`, newFilename);

      // Move file and overwrite existing
      fs.renameSync(file.path, savePath);

      imageUrl = `${env.IMAGE_DIR}/users/${newFilename}`;
    }

    // Update user
    const result = await UserModel.update({
      userId,
      email: newEmail,
      password,
      role,
      fName,
      lName,
      profilePic: imageUrl || null,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
