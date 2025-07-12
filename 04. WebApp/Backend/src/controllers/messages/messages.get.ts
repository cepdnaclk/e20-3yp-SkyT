import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { NotificationModel } from "../../model/notifications";

export const getNotifications: RequestHandler = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);

    console.log("User " + userId + " is requesting messages for him");

    if (isNaN(userId)) {
      throw createHttpError(400, "Missing required fields");
    }

    const notifications = await NotificationModel.getAll(userId);
    console.log("Notifications: ", notifications);

    res
      .status(200)
      .json({ message: "Notifications get successfully", notifications });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
