import express from "express";
import multer from "multer";
import { compressAndSaveImage } from "../util/imageHelper";

const router = express.Router();

// Use multer with memory storage (to buffer before processing)
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const filename = await compressAndSaveImage(req.file);
    res.status(200).json({ message: "Image uploaded", filename });
  } catch (err) {
    next(err);
  }
});

export default router;
