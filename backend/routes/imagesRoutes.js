import express from "express";
import multer from "multer";
import fs from "fs";
import {Jimp} from "jimp";
import pixelmatch from "pixelmatch";
import path from "path";

const port = process.env.PORT || 5000;
const router = express.Router();
const upload = multer({ dest: "uploads/images" });

router.post("/", upload.array("images", 2), async (req, res) => {
    if (req.files.length < 2) {
        return res.status(400).json({ error: "Please upload two images" });
    }

    const [img1Path, img2Path] = req.files.map((file) => file.path);
    const diffPath = `uploads/images/diff-${Date.now()}.png`;

    try {
        // Use the named Jimp export
        const img1 = await Jimp.read(img1Path);
        const img2 = await Jimp.read(img2Path);
        
        const { width, height } = img1.bitmap;
        if (width !== img2.bitmap.width || height !== img2.bitmap.height) {
            return res.status(400).json({ error: "Images must be of the same dimensions" });
        }

        // Create a new Jimp image using the object syntax
        const diff = new Jimp({ width, height });
        
        pixelmatch(
            img1.bitmap.data,
            img2.bitmap.data,
            diff.bitmap.data,
            width,
            height,
            { threshold: 0.1 }
        );

        // Use the write method instead of writeAsync
        await diff.write(diffPath);

        res.json({ diffUrl: `http://localhost:${port}/uploads/images/${path.basename(diffPath)}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error processing images" });
    } finally {
        // Cleanup uploaded files
        fs.unlinkSync(img1Path);
        fs.unlinkSync(img2Path);
    }
});

export default router;
