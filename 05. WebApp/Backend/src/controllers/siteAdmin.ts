import env from "../util/validateEnv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { RequestHandler } from "express";
import SiteAdminModel from "../models/SiteAdmins";

export const createSiteAdmin: RequestHandler = async (req, res, next) => {
  try {
    const { name, role, username, password } = req.body;

    // Ensure all required fields are provided
    if (!name || !role || !username || !password) {
      console.log("Missing field detected");
      throw createHttpError(400, "Missing field found");
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, env.HASHING_SALT);

    // Create a new Site Admin
    const newAdmin = await SiteAdminModel.create({
      name,
      role,
      username,
      password: hashedPassword,
    });

    // Respond with the created site Admin
    res.status(201).json({ message: "User registered successfully!" });
    console.log("Site Admin created successfully!", newAdmin);
  } catch (error) {
    next(error);
  }
};

export const getSiteAdmins: RequestHandler = async (req, res, next) => {
  try {
    console.log("Fetching site admins...");
    const admins = await SiteAdminModel.find();

    if (!admins.length) throw createHttpError(404, "No admins found.");

    console.log(`Found ${admins.length} admin(s).`);
    res.status(200).json(admins);
  } catch (error) {
    next(error);
  }
};

export const verifySiteAdmin: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log("New login: ", req.body);

    const user = await SiteAdminModel.findOne({ username });

    if (!user) throw createHttpError(400, "Invalid credentials");
    console.log("User:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Is Match: ", isMatch);

    if (!isMatch) throw createHttpError(400, "Invalid credentials");

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      env.JWT_SECRET as string,
      {
        expiresIn: "2h",
      }
    );

    console.log("Admins got successfully!");
    res
      .status(200)
      .json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    next(error);
  }
};

export const upateSiteAdmins: RequestHandler = async (req, res, next) => {
  try {
    // Destructuring object
    const { _id, role, password } = req.body;

    if (!_id) throw createHttpError(400, "Admin ID is required for updating.");
    console.log(`Update id: ${_id} with data: ${role} ${password}`);

    let updateData;

    if (!password && !role) throw createHttpError(400, "Nothing to update.");

    if (!password) updateData = { role };
    else {
      // Hash password before storing
      const hashedPassword = await bcrypt.hash(password, env.HASHING_SALT);

      if (!role) updateData = { password: hashedPassword };
      else updateData = { password: hashedPassword, role };
    }

    // Use the _id to find the admin and update the relevant data
    const updatedAdmin = await SiteAdminModel.findByIdAndUpdate(
      _id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAdmin) {
      console.log("Admin not found!");
      throw createHttpError(404, "Admin not found");
    }

    console.log("Admin updated successfully!");
    res.status(200).json("success");
  } catch (error) {
    next(error);
  }
};

export const deleteSiteAdmin: RequestHandler = async (req, res, next) => {
  try {
    // Destructuring object
    const id = req.body._id;
    console.log(`Delete site admin id: ${id}`);

    // Use the _id to find the teacher and delete the relevant data
    const deletedTeacher = await SiteAdminModel.findByIdAndDelete(id);

    if (!deletedTeacher) {
      console.log("Teacher not found!");
      throw createHttpError(404, "Teacher not found");
    }

    console.log("User admin deleted successfully!");
    res.status(200).json("success");
  } catch (error) {
    next(error);
  }
};
