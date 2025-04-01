import multer from "multer";
import fs from "fs";

// Configure multer storage
const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "uploads/videos";
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Create multer upload instance
const upload = multer({ storage: videoStorage });

export default upload;