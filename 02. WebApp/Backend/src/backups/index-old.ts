import app from "../app";
import "dotenv/config";
import env from "../util/validateEnv";
import mongoose from "mongoose";

const port = env.MYNODEPORT;
const mongoDB = env.MONGO_URI;

mongoose
  .connect(mongoDB)
  .then(() => {
    console.log("Mongoose connected successfully!");
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch(console.error);
