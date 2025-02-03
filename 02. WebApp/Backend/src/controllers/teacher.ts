import { RequestHandler } from "express";
import TeacherModel from "../models/Teacher";

export const createTeacher: RequestHandler = async (req, res, next) => {
  try {
    const { name, role, avatar } = req.body;
    //console.log(`New teacher: ${name}, ${role}, ${avatar}`);

    // Check if the necessary fields are provided
    if (!name || !role) {
      return res
        .status(400)
        .json({ message: "All fields are required: name, role, avatar" });
    }

    // Create a new teacher
    const createdTeacher = await TeacherModel.create({ name, role, avatar });

    // Respond with the created gallery entry
    res.status(201).json("succes");
    console.log("Teacher created successfully!");
  } catch (error) {
    next(error);
  }
};

export const getTeachers: RequestHandler = async (req, res, next) => {
  try {
    const query = await TeacherModel.find();
    console.log("Teachers got successfully!");
    res.status(200).json(query);
  } catch (error) {
    next(error);
  }
};

export const updateTeacher: RequestHandler = async (req, res, next) => {
  try {
    // Destructuring object
    const { _id, ...updateData } = req.body;
    //console.log(`Update id: ${_id} with data: ${updateData}`);

    // Use the _id to find the teacher and update the relevant data
    const updatedTeacher = await TeacherModel.findByIdAndUpdate(
      _id,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedTeacher) {
      console.log("Teacher not found!");
      return res.status(404).json({ message: "Teacher not found" });
    }

    console.log("Teacher updated successfully!");
    res.status(200).json("success");
  } catch (error) {
    next(error);
  }
};

export const deleteTeacher: RequestHandler = async (req, res, next) => {
  try {
    // Destructuring object
    const id = req.body._id;
    console.log(`Delete teacher id: ${id}`);

    // Use the _id to find the teacher and delete the relevant data
    const deletedTeacher = await TeacherModel.findByIdAndDelete(id);

    if (!deletedTeacher) {
      console.log("Teacher not found!");
      return res.status(404).json({ message: "Teacher not found" });
    }

    console.log("Teacher deleted successfully!");
    res.status(200).json("success");
  } catch (error) {
    next(error);
  }
};
