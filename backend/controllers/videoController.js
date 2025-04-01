import fs from "fs";
import path from "path";
import { extractFrames, compareFrames } from "../models/videoModel.js";

// Upload videos controller
export const uploadVideos = async (req, res) => {
    try {
        const files = req.files;
        if (!files.video1 || !files.video2) {
            return res.status(400).json({ error: "Please upload exactly 2 videos" });
        }

        let videoPaths = [files.video1[0].path, files.video2[0].path];
        console.log("✅ Uploaded Videos:", videoPaths);
        res.json({ videos: videoPaths });
    } catch (error) {
        console.error("❌ Upload Error:", error);
        res.status(500).json({ error: "Upload failed", details: error.message });
    }
};

// Compare videos controller
export const compareVideos = async (req, res) => {
    try {
        const { videos } = req.body;
        if (!videos || videos.length !== 2) {
            return res.status(400).json({ error: "Two videos required" });
        }

        const outputFolder = "uploads/frames";
        if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder, { recursive: true });

        const video1FramesFolder = path.join(outputFolder, "video1");
        const video2FramesFolder = path.join(outputFolder, "video2");

        if (!fs.existsSync(video1FramesFolder)) fs.mkdirSync(video1FramesFolder, { recursive: true });
        if (!fs.existsSync(video2FramesFolder)) fs.mkdirSync(video2FramesFolder, { recursive: true });

        await extractFrames(videos[0], video1FramesFolder);
        await extractFrames(videos[1], video2FramesFolder);

        const frames1 = fs.readdirSync(video1FramesFolder).sort();
        const frames2 = fs.readdirSync(video2FramesFolder).sort();

        if (frames1.length !== frames2.length) {
            return res.status(400).json({ error: "Frame extraction mismatch" });
        }

        let timestampData = [];
        for (let i = 0; i < frames1.length; i++) {
            const frame1Path = path.join(video1FramesFolder, frames1[i]);
            const frame2Path = path.join(video2FramesFolder, frames2[i]);

            const isDifferent = await compareFrames(frame1Path, frame2Path);
            if (isDifferent) {
                timestampData.push({
                    timestamp: `${i} sec`,
                    frame1: `/frames/video1/${frames1[i]}`,
                    frame2: `/frames/video2/${frames2[i]}`
                });
            }
        }

        console.log("✅ Differences Found:", timestampData);
        res.json({ timestampData });

    } catch (error) {
        console.error("❌ Compare Error:", error);
        res.status(500).json({ error: "Comparison failed", details: error.message });
    }
};