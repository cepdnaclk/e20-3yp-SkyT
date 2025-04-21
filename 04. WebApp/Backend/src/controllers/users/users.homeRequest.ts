import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../../model/users";

export const homeRequest: RequestHandler = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);

    console.log("Request summary of user: ", userId);

    // Validate input
    if (isNaN(userId)) {
      throw createHttpError(400, "Invalid user ID");
    }

    // Get info
    const result = await UserModel.findById(userId);

    if (!result) {
      throw createHttpError(404, "User not found");
    }

    const { fName, profilePic } = result;

    // Get Message count (future)
    const msgCount = 10;

    console.log({ userId, fName, profilePic, msgCount });

    res
      .status(200)
      .json({
        message: "User found successfully",
        msgCount,
        fName,
        profilePic,
      });
  } catch (error) {
    next(error);
  }
};
