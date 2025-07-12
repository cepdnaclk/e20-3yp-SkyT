import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../../model/users";

export const getInfo: RequestHandler = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);

    console.log("Request details of user: ", userId);

    // Validate input
    if (isNaN(userId)) {
      throw createHttpError(400, "Invalid user ID");
    }

    // Get info
    const result = await UserModel.findById(userId);

    if (!result) {
      throw createHttpError(404, "User not found");
    }

    console.log("Resuls: ", result);

    res.status(200).json({ result, message: "User found successfully" });
  } catch (error) {
    next(error);
  }
};
