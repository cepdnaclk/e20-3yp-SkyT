import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

const MAX_SIZE_MB = 5;

export const createUploadMiddleware = (subfolder: string) => {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      const dirPath = path.join("images", subfolder); // Or use env.IMAGE_DIR
      fs.mkdirSync(dirPath, { recursive: true });
      cb(null, dirPath);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `temp-${Date.now()}${ext}`;
      cb(null, filename);
    },
  });

  const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
  }).single("imageFile");
};
