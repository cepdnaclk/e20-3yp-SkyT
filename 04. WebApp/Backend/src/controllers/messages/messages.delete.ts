import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { NotificationModel } from "../../model/notifications";

export const deleteMessage: RequestHandler = async (req, res, next) => {
  try {
    const { msgId, userId } = req.body;
    console.log("user " + userId + " deletes the message " + msgId);

    if (isNaN(msgId) || isNaN(userId)) {
      throw createHttpError(400, "Missing required fields");
    }

    const reply = await NotificationModel.delete(userId, msgId);

    console.log(reply);
    res.status(200).json(reply);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
