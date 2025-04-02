import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from 'url';
import path from "path";
import videoRoutes from "./routes/videoRoutes.js";
import textRoutes from "./routes/textRoutes.js";
import imagesRoutes from "./routes/imagesRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import docsRoutes from "./routes/docsRoutes.js";
// Load environment variables
dotenv.config();

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000", "https://diff-0-matic.vercel.app/"],
    methods: "GET,POST",
    allowedHeaders: "Content-Type,Authorization"
}));

// Serve static files
app.use('/frames', express.static(path.join(__dirname, 'uploads/frames')));
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));

// Routes
app.use("/api/videos", videoRoutes);
app.use("/api/text", textRoutes);
app.use("/api/images", imagesRoutes);
app.use("/api/folder", folderRoutes);
app.use("/api/docs", docsRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));