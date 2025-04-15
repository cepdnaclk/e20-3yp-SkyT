import { RequestHandler } from "express";
import FeedbackModel from "../models/Feedback";

export const createFeedback: RequestHandler = async (req, res, next) => {
  try {
    const { name, role, date, note } = req.body;
    //console.log(`New teacher: ${name}, ${role}, ${avatar}`);

    // Check if the necessary fields are provided
    if (!name || !role || !date || !note) {
      return res
        .status(400)
        .json({ message: "All fields are required: name, role, avatar" });
    }

    // Create a new teacher
    const createdTeacher = await FeedbackModel.create({
      name,
      role,
      note,
      date,
    });

    // Respond with the created gallery entry
    res.status(201).json("succes");
    console.log("Teacher created successfully!");
  } catch (error) {
    next(error);
  }
};

export const getFeedbacks: RequestHandler = async (req, res, next) => {
  try {
    const query = await FeedbackModel.find();
    console.log("Feedbacks got successfully!");
    res.status(200).json(query);
  } catch (error) {
    next(error);
  }
};

export const updateFeedback: RequestHandler = async (req, res, next) => {
  try {
    // Destructuring object
    const { _id, ...updateData } = req.body;
    //console.log(`Update id: ${_id} with data: ${updateData}`);

    // Use the _id to find the Feedback and update the relevant data
    const updatedFeedback = await FeedbackModel.findByIdAndUpdate(
      _id,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedFeedback) {
      console.log("Feedback not found!");
      return res.status(404).json({ message: "Feedback not found" });
    }

    console.log("Feedback updated successfully!");
    res.status(200).json("success");
  } catch (error) {
    next(error);
  }
};

export const deleteFeedback: RequestHandler = async (req, res, next) => {
  try {
    // Destructuring object
    const id = req.body._id;
    console.log(`Delete feedback id: ${id}`);

    // Use the _id to find the teacher and delete the relevant data
    const deletedFeedback = await FeedbackModel.findByIdAndDelete(id);

    if (!deletedFeedback) {
      console.log("Feedback not found!");
      return res.status(404).json({ message: "Feedback not found" });
    }

    console.log("Feedback deleted successfully!");
    res.status(200).json("success");
  } catch (error) {
    next(error);
  }
};
