import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../../model/users";
import sendDeleteEmail from "../../service/sendDeleteEmail";

export const deleteAssistant: RequestHandler = async (req, res, next) => {
  try {
    const { userId, managerId } = req.body;

    console.log("Delete Assistant: " + userId + " by user: " + managerId);

    // Validate input
    if (isNaN(userId) || isNaN(managerId)) {
      throw createHttpError(400, "Invalid user ID");
    }

    // Delete assistant
    const email = await UserModel.deleteAssistant(userId, managerId);

    // Send email to notify the deletion
    console.log("Send email to ", email);
    await sendDeleteEmail(email);

    console.log("User deleted successfully");

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
