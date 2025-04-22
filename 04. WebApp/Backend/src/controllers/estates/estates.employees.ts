import { RequestHandler } from "express";
import createHttpError from "http-errors";
import EstateModel from "../../model/estates";
import UserModel from "../../model/users";

export const employees: RequestHandler = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    console.log("Manager/Developer: ", userId);

    if (isNaN(userId)) {
      throw createHttpError(400, "Invalid user ID");
    }

    const user = await UserModel.findById(userId);

    console.log("Role: ", user.role);

    let employees;
    if (user.role === "Developer") {
      employees = await UserModel.getUsers();
    } else {
      employees = await EstateModel.getEmployees(userId);
    }

    console.log("Employees: ", employees);

    res
      .status(200)
      .json({ message: "Employees found successfully", employees });
  } catch (error) {
    next(error);
  }
};
