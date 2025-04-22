import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../../model/users";

export const deleteAssistant: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.body;

    console.log("Delete Assistant: ", userId);

    // Validate input
    if (isNaN(userId)) {
      throw createHttpError(400, "Invalid user ID");
    }

    // Delete assistant
    const result = await UserModel.deleteAssistant(userId);

    console.log(result.message);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
