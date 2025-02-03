import { RequestHandler, Response } from "express";
import NewsModel from "../models/News";

interface DetailsProp {
  title: string;
  description: string;
  imageUrl: string;
  publishedAt: string;
  star: boolean;
  res: Response;
}

function handleNews({
  title,
  description,
  imageUrl,
  publishedAt,
  star,
  res,
}: DetailsProp) {
  console.log(
    `New news: \nTitle: ${title}\n Description: ${description}\n publish: ${publishedAt}\n URL: ${imageUrl}\n Star:${star}`
  );

  // Check if the necessary fields are provided
  if (!title || !description) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  return { title, description, imageUrl, publishedAt, star };
}

export const createNews: RequestHandler = async (req, res, next) => {
  try {
    const { _id, ...details } = req.body;

    // Create a new teacher
    const createdTeacher = await NewsModel.create(handleNews(details));

    // Respond with the created news entry
    res.status(201).json("succes");
    console.log("News created successfully!");
  } catch (error) {
    next(error);
  }
};

export const getNewsList: RequestHandler = async (req, res, next) => {
  try {
    const query = await NewsModel.find();
    console.log("News list got successfully!");
    res.status(200).json(query);
  } catch (error) {
    next(error);
  }
};

export const updateNews: RequestHandler = async (req, res, next) => {
  try {
    // Destructuring object
    const { _id, ...updateData } = req.body;

    // Use the _id to find the news and update the relevant data
    const updatedNews = await NewsModel.findByIdAndUpdate(
      _id,
      handleNews(updateData),
      {
        new: true,
      }
    );

    if (!updatedNews) {
      console.log("News not found!");
      return res.status(404).json({ message: "News not found" });
    }

    console.log("News updated successfully!");
    res.status(200).json("success");
  } catch (error) {
    next(error);
  }
};

export const deleteNews: RequestHandler = async (req, res, next) => {
  try {
    // Destructuring object
    const id = req.body._id;
    console.log(`Delete news id: ${id}`);

    // Use the _id to find the news and delete the relevant data
    const deletedNews = await NewsModel.findByIdAndDelete(id);

    if (!deletedNews) {
      console.log("News not found!");
      return res.status(404).json({ message: "News not found" });
    }

    console.log("News deleted successfully!");
    res.status(200).json("success");
  } catch (error) {
    next(error);
  }
};
