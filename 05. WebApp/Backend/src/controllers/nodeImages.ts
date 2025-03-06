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

// Function to fetch all image IDs for a given lot number
const getImageIdsFromMySQL = async (lotNumber: number): Promise<string[]> => {
  try {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.query(
      "SELECT image_ID FROM Lot_Images WHERE lot_number = ?",
      [lotNumber]
    );
    connection.release();

    return rows.map((row: any) => row.image_ID); // Return all image IDs as an array
  } catch (error) {
    console.error("MySQL Error:", error);
    return [];
  }
};

// Function to retrieve and save image from GridFS along with uploadDate
const retrieveImage = async (
  imageId: string
): Promise<{ path: string; uploadDate: string } | null> => {
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

    return {
      path: savePath,
      uploadDate: file.uploadDate.toISOString(), // Convert uploadDate to ISO string
    };
  } catch (error) {
    console.error("Error retrieving image:", error);
    return null;
  }
};

// **Controller to Get Images**
export const getImages: RequestHandler = async (req, res, next) => {
  try {
    console.log("Lot_ID: ", req.query.lotId);
    const lotId = parseInt(req.query.lotId as string);
    if (isNaN(lotId)) {
      return res.status(400).json({ error: "Invalid lotId parameter" });
    }

    // Get all image IDs from MySQL
    const imageIds = await getImageIdsFromMySQL(lotId);
    if (imageIds.length === 0) {
      return res.status(404).json({ error: "No images found for this lot" });
    }

    console.log("Lot images", imageIds);

    // Retrieve each image from MongoDB
    const imagesData = await Promise.all(
      imageIds.map(async (imageId) => {
        const imageData = await retrieveImage(imageId);
        if (!imageData) return null;

        return {
          id: lotId,
          timestamp:
            new Date().toLocaleTimeString() +
            " " +
            new Date().toLocaleDateString(),
          lotNo: `Node ${lotId}`,
          imageSrc: `${req.protocol}://${req.get(
            "host"
          )}/downloads/${imageId}.jpg`,
          uploadDate: imageData.uploadDate, // Include upload date in response
        };
      })
    );

    // Remove any failed image retrievals
    const response = imagesData.filter((image) => image !== null);

    console.log("Response: ", response);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
