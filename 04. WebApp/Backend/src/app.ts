import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
//import path from "path";

// Import routes
//import imageRoute from "./route/image";

const app = express();

app.get("/", (req, res) => {
  console.log("Hello to the user");
  res.send("Hello, World!");
});

// Static serve images from downloads/ folder
//app.use("/images", express.static(path.join(__dirname, "downloads")));

// Routes
//app.use("/api/images", imageRoute);

// 404 Handler
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

// Error Function Middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  // Default case error
  let errMsg = "An unknown error occured!";
  let statusCode = 500;

  // Unique error
  if (isHttpError(err)) {
    errMsg = err.message;
    statusCode = err.status;
  }

  res.status(statusCode).json({ error: errMsg });
});

export default app;
