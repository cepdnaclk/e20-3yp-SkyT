import { RequestHandler } from "express";
import pool from "../database/awsDBConfig";
import { MongoClient, GridFSBucket, ObjectId } from "mongodb";
import * as fs from "fs";
import { promisify } from "util";
import path from "path";
import env from "../util/validateEnv";

// MongoDB Connection
const MONGO_URI = env.MONGO_URI;
const DB_NAME = env.MONGO_DBNAME;
let mongoClient: MongoClient;
let bucket: GridFSBucket;

// Initialize MongoDB Connection
const connectMongoDB = async () => {
  try {
    mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();
    const db = mongoClient.db(DB_NAME);
    bucket = new GridFSBucket(db, { bucketName: "images" });
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
};
connectMongoDB(); // Run the connection on startup

// Function to fetch image ID from MySQL
const getImageIdFromMySQL = async (
  lotNumber: number
): Promise<string | null> => {
  try {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.query(
      "SELECT image_ID FROM Lot_Images WHERE lot_number = ?",
      [lotNumber]
    );
    connection.release();

    if (rows.length > 0) {
      return rows[0].image_ID; // Return only the image ID
    } else {
      console.log(`Error: No image found for lot_number ${lotNumber}`);
      return null;
    }
  } catch (error) {
    console.error("MySQL Error:", error);
    return null;
  }
};

// Function to retrieve and save image from GridFS
const retrieveImage = async (imageId: string): Promise<string | null> => {
  try {
    const objectId = new ObjectId(imageId);
    const cursor = bucket.find({ _id: objectId });
    const file = await cursor.next();
    if (!file) {
      console.log(`Error: No file found with ID ${imageId}`);
      return null;
    }

    const savePath = path.join(__dirname, "../downloads", `${imageId}.jpg`);
    const downloadStream = bucket.openDownloadStream(objectId);
    const fileStream = fs.createWriteStream(savePath);
    const pipeline = promisify(require("stream").pipeline);

    await pipeline(downloadStream, fileStream);
    console.log(`Image retrieved and saved as ${savePath}`);
    return savePath;
  } catch (error) {
    console.error("Error retrieving image:", error);
    return null;
  }
};

// Controller to Get Images
export const getImages: RequestHandler = async (req, res, next) => {
  try {
    console.log("Lot_ID: ", req.query.lotId);
    const lotId = parseInt(req.query.lotId as string);
    if (isNaN(lotId)) {
      return res.status(400).json({ error: "Invalid lotId parameter" });
    }

    // Get image ID from MySQL
    const imageId = await getImageIdFromMySQL(lotId);
    if (!imageId) {
      return res.status(404).json({ error: "Image not found in MySQL" });
    }

    console.log("Lot images", imageId);

    // Retrieve image from MongoDB
    const imagePath = await retrieveImage(imageId);
    if (!imagePath) {
      return res.status(404).json({ error: "Image not found in MongoDB" });
    }

    // Create response format
    const response = [
      {
        id: lotId,
        timestamp:
          new Date().toLocaleTimeString() +
          " " +
          new Date().toLocaleDateString(),
        lotNo: `Node ${lotId}`,
        imageSrc: `${req.protocol}://${req.get(
          "host"
        )}/downloads/${imageId}.jpg`,
      },
    ];

    console.log("Response: ", response);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
