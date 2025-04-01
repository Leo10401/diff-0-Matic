import express from "express";
import { uploadVideos, compareVideos } from "../controllers/videoController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Upload videos route
router.post("/upload", upload.fields([{ name: "video1" }, { name: "video2" }]), uploadVideos);

// Compare videos route
router.post("/compare", compareVideos);

export default router;