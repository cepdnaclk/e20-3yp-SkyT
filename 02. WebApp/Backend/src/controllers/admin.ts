import { RequestHandler } from "express";
import AdminModel from "../models/Admin";

export const createAdmin: RequestHandler = async (req, res, next) => {
  try {
    // Create a new Gallery event with images
    const query = await AdminModel.create({
      avatar: "https://picsum.photos/200/200?image=0",
      name: "John Doe4",
      role: "CFO",
      org: "sample Org",
    });

    // Respond with the created gallery entry
    res.status(201).json(query);
    console.log("Admin created successfully!");
  } catch (error) {
    next(error);
  }
};

export const getAdmins: RequestHandler = async (req, res, next) => {
  try {
    const query = await AdminModel.find();
    console.log("Admins got successfully!");
    res.status(200).json(query);
  } catch (error) {
    next(error);
  }
};

export const upateAdmins: RequestHandler = async (req, res, next) => {
  try {
    // Destructuring object
    const { _id, ...updateData } = req.body;
    //console.log(`Update id: ${_id} with data: ${updateData}`);

    // Use the _id to find the admin and update the relevant data
    const updatedAdmin = await AdminModel.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    if (!updatedAdmin) {
      console.log("Admin not found!");
      return res.status(404).json({ message: "Admin not found" });
    }

    console.log("Admin updated successfully!");
    res.status(200).json("success");
  } catch (error) {
    next(error);
  }
};
