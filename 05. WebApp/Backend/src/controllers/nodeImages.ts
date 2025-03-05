import { RequestHandler } from "express";
//import ImageModel from "../models/NodeImages";

const DATA = [
  {
    id: 1,
    timestamp: "10:58:22 AM 05/03/2025",
    lotNo: "Node A",
    imageSrc: "https://www.w3schools.com/w3images/fjords.jpg",
  },
  {
    id: 2,
    timestamp: "11:05:10 AM 05/03/2025",
    lotNo: "Node B",
    imageSrc: "https://www.w3schools.com/w3images/lights.jpg",
  },
  {
    id: 3,
    timestamp: "11:12:45 AM 05/03/2025",
    lotNo: "Node C",
    imageSrc: "https://www.w3schools.com/w3images/mountains.jpg",
  },
  {
    id: 4,
    timestamp: "11:20:30 AM 05/03/2025",
    lotNo: "Node D",
    imageSrc: "https://www.w3schools.com/w3images/forest.jpg",
  },
];

export const getImages: RequestHandler = async (req, res, next) => {
  try {
    //const query = await FeedbackModel.find();
    const query = DATA;
    console.log("Images got successfully!", query);
    res.status(200).json(query);
  } catch (error) {
    next(error);
  }
};
