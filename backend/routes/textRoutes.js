import bodyParser from "body-parser";
import { diffWords } from "diff";
import express from "express";

const router = express.Router();

router.use(bodyParser.json());

router.post("/compare-text", (req, res) => {
    const { text1, text2 } = req.body;

    if (!text1 || !text2) {
        return res.status(400).json({ error: "Both texts are required." });
    }

    const diffResult = diffWords(text1, text2);
    
    res.json({ differences: diffResult });
});

export default router;
