import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { NotificationModel } from "../../model/notifications";

export const markAsRead: RequestHandler = async (req, res, next) => {
  try {
    const { msgId, userId } = req.body;
    console.log("user " + userId + " reads the message " + msgId);

    if (isNaN(msgId) || isNaN(userId)) {
      throw createHttpError(400, "Missing required fields");
    }

    const reply = await NotificationModel.markAsRead(userId, msgId);

    console.log(reply);
    res.status(201).json(reply);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
