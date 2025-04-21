// For future use

import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../../model/users";

const allowedRoles = ["Owner", "Developer", "Assistant"];

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const { id, email, role, fName, lName, profilePic, estates } = req.body;

    console.log("Updating user: ", req.body);

    if (
      !id ||
      !fName ||
      !email ||
      !allowedRoles.includes(role) ||
      estates.length === 0
    ) {
      throw createHttpError(400, "Missing required fields");
    }

    /* const result = await UserModel.update({
      userId: id,
      email,
      role,
      fName,
      lName,
      profilePic,
      estates,
    });
    res.status(200).json(result); */
  } catch (error) {
    next(error);
  }
};
