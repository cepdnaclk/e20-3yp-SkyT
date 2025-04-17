import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel, { NewUser } from "../model/users";
import generatePassword from "../util/generatePassword";
import { sendPasswordEmail } from "../service/mailer";

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { email, role, fName, lName, estates } = req.body;
    console.log("New request from: ", req.body);

    // Validate input
    if (!email || !fName || estates.length === 0) {
      throw createHttpError(400, "Required fields missing");
    }

    // Generate the random password
    const password = generatePassword(10);

    // Create user
    const user: NewUser = { email, password, role, fName, lName };
    const userId = await UserModel.create(user);

    console.log("User " + userId + " has been created. Password: " + password);

    // Send email
    await sendPasswordEmail(email, password);

    res.status(201).send("User created successfully!");
  } catch (error) {
    next(error);
  }
};
