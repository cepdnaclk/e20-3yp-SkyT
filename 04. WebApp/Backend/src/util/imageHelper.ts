import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

const DOWNLOADS_DIR = path.join(__dirname, "..", "downloads");

export const compressAndSaveImage = async (
  file: Express.Multer.File
): Promise<string> => {
  const ext = path.extname(file.originalname).toLowerCase();
  const filename = `${Date.now()}-${file.originalname}`;
  const filepath = path.join(DOWNLOADS_DIR, filename);

  await sharp(file.buffer)
    .resize({ width: 800 }) // Resize or customize as needed
    .toFormat("jpeg")
    .jpeg({ quality: 80 }) // Compress quality
    .toFile(filepath);

  return filename; // Return just the filename for easy reference
};

export const getImagePath = (filename: string): string => {
  return path.join(DOWNLOADS_DIR, filename);
};
