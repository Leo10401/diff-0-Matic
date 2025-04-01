import ffmpeg from "fluent-ffmpeg";
import sharp from "sharp";
import { ssim } from "ssim.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import ffmpegPath from "ffmpeg-static";

// Get current file path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set FFmpeg path from the ffmpeg-static package
console.log(`Setting FFmpeg path to: ${ffmpegPath}`);

// Verify that the FFmpeg binary exists
if (!fs.existsSync(ffmpegPath)) {
  console.error(`❌ FFmpeg not found at: ${ffmpegPath}`);
} else {
  console.log(`✅ Found FFmpeg at: ${ffmpegPath}`);
}

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

// Extract frames from video
export const extractFrames = async (videoPath, outputFolder) => {
    return new Promise((resolve, reject) => {
        // Ensure output folder exists
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder, { recursive: true });
        }
        
        console.log(`Starting frame extraction from: ${videoPath}`);
        console.log(`Output folder: ${outputFolder}`);
        
        ffmpeg(videoPath)
            .on("start", (commandLine) => {
                console.log(`FFmpeg command: ${commandLine}`);
            })
            .on("progress", (progress) => {
                if (progress.percent) {
                    console.log(`Processing: ${Math.round(progress.percent)}% done`);
                }
            })
            .on("end", () => {
                console.log("✅ Frame extraction complete");
                resolve(outputFolder);
            })
            .on("error", (err) => {
                console.error(`❌ Error extracting frames: ${err.message}`);
                reject(err);
            })
            .output(path.join(outputFolder, `${path.basename(videoPath, ".mp4")}-frame-%03d.png`))
            .outputOptions(["-vf", "fps=1,scale=1280:720"])
            .run();
    });
};

// Compare two frames for differences
export const compareFrames = async (frame1, frame2) => {
    try {
        console.log(`Comparing frames:\n- ${frame1}\n- ${frame2}`);

        // Ensure files exist
        if (!fs.existsSync(frame1) || !fs.existsSync(frame2)) {
            console.error("❌ Frame file not found:", frame1, frame2);
            return false;
        }

        // Convert to raw RGB
        const img1Data = await sharp(frame1).resize(1280, 720).raw().toBuffer({ resolveWithObject: true });
        const img2Data = await sharp(frame2).resize(1280, 720).raw().toBuffer({ resolveWithObject: true });

        const img1 = img1Data.data;
        const img2 = img2Data.data;
        
        console.log(`✅ Loaded frames successfully. Buffer sizes: ${img1.length}, ${img2.length}`);

        if (!img1 || !img2 || img1.length === 0 || img2.length === 0) {
            throw new Error("❌ One of the frames could not be processed.");
        }

        // Get image dimensions
        const width = 1280;
        const height = 720;
        const channels = 3; // RGB

        // Create correctly formatted matrices for SSIM
        const matrix1 = {
            width: width,
            height: height,
            data: new Uint8Array(img1),
            channels: channels
        };
        
        const matrix2 = {
            width: width,
            height: height,
            data: new Uint8Array(img2),
            channels: channels
        };

        const { mssim } = ssim(matrix1, matrix2);

        console.log(`🔍 SSIM Value: ${mssim}`);
        return mssim < 0.85; // Returns true if different
    } catch (error) {
        console.error("❌ Error comparing frames:", error);
        return false;
    }
};

// Schedule cleanup for old files (to be called from server.js if needed)
export const scheduleCleanup = () => {
    const deleteFolder = (folder) => {
        if (fs.existsSync(folder)) {
            fs.readdirSync(folder).forEach((file) => {
                const filePath = path.join(folder, file);
                if (!fs.statSync(filePath).isDirectory()) {
                    fs.unlinkSync(filePath);
                }
            });
            console.log(`✅ Deleted old files from ${folder}`);
        }
    };

    return {
        deleteFolder
    };
};