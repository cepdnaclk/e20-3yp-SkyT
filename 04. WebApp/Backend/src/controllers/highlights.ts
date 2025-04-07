import { RequestHandler } from "express";
import NewsModel from "../models/News";

export const getHighlights: RequestHandler = async (req, res, next) => {
  try {
    const query = await NewsModel.find();
    console.log("Highlight list got successfully!");
    const highlights = query.filter((news) => news.star === true);
    res.status(200).json(highlights);
  } catch (error) {
    next(error);
  }
};
