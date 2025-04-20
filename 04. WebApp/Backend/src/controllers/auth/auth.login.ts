import { RequestHandler } from "express";
import argon2 from "argon2";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import env from "../../util/validateEnv";
import UserModel from "../../model/users";

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createHttpError(400, "Email and password are required"));
  }

  try {
    // 1. Find user by email
    const user = await UserModel.findByEmail(email.toLowerCase().trim());
    console.log("User: ", user);
    if (!user) {
      throw next(createHttpError(404, "User not found"));
    }

    // 2. Verify password using argon2
    const passwordMatch = await argon2.verify(user.password, password);
    if (!passwordMatch) {
      throw next(createHttpError(401, "Invalid password"));
    }

    // 3. Generate JWT token
    const payload = {
      userId: user.userId,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "6h" });

    console.log("Login successful");

    res.status(200).json({ message: "Login successful", token, payload });
  } catch (error) {
    next(error);
  }
};
