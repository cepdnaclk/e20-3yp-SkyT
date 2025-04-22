import { RequestHandler } from "express";
import createHttpError from "http-errors";
import EstateModel from "../../model/estates";

export const updateEstates: RequestHandler = async (req, res, next) => {
  try {
    const { id, estates } = req.body;

    console.log("Updating user: ", req.body);

    if (isNaN(id) || estates.length === 0) {
      throw createHttpError(400, "Missing required fields");
    }

    const result = await EstateModel.update({ userId: id, estates });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
