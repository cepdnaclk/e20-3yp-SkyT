import "dotenv/config";
import env from "../util/validateEnv";
import mongoose from "mongoose";

const mongoUri = env.MONGO_URI;

mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));
