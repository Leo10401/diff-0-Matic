import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mammoth from "mammoth";
import { PDFExtract } from "pdf.js-extract";
import DiffMatchPatch from "diff-match-patch";
import Tesseract from "tesseract.js";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure uploads/docs directory exists
const uploadDir = path.join(__dirname, "../uploads/docs");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Configure Multer for storing files in uploads/docs/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Function to extract text from DOCX
const extractTextFromDocx = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return { text: result.value, isOcr: false };
  } catch (error) {
    console.error("Error extracting text from DOCX:", error.message);
    return { text: "", isOcr: false };
  }
};

// Function to extract text from PDF using pdf.js-extract
const extractTextFromPdf = async (filePath) => {
  try {
    const pdfExtract = new PDFExtract();
    const options = {}; // Default options
    
    const data = await pdfExtract.extract(filePath, options);
    
    // Combine text from all pages
    let text = "";
    if (data && data.pages) {
      data.pages.forEach(page => {
        if (page.content) {
          page.content.forEach(item => {
            if (item.str) {
              text += item.str + " ";
            }
          });
          text += "\n\n"; // Add line breaks between pages
        }
      });
    }
    
    return { text, isOcr: false };
  } catch (error) {
    console.error("Error extracting text from PDF:", error.message);
    return { text: "", isOcr: false };
  }
};

// Function to extract text using OCR (for images)
const extractTextFromImage = async (filePath) => {
  try {
    const { data } = await Tesseract.recognize(filePath, "eng", {
      logger: m => console.log(m)
    });
    return { 
      text: data.text,
      isOcr: true,
      confidence: data.confidence,
      words: data.words
    };
  } catch (error) {
    console.error("Error extracting text from image:", error.message);
    return { text: "", isOcr: true };
  }
};

// Function to compare text differences
const compareText = (text1, text2) => {
  const dmp = new DiffMatchPatch();
  const diffs = dmp.diff_main(text1, text2);
  dmp.diff_cleanupSemantic(diffs);
  return diffs;
};

// Function to analyze OCR-specific differences
const analyzeOcrDifferences = (ocrResult1, ocrResult2) => {
  const analysis = {
    overallConfidence1: ocrResult1.confidence || 0,
    overallConfidence2: ocrResult2.confidence || 0,
    lowConfidenceWords1: [],
    lowConfidenceWords2: [],
    potentialMisreads: []
  };
  
  // Identify low confidence words (below 80% confidence)
  if (ocrResult1.words) {
    analysis.lowConfidenceWords1 = ocrResult1.words
      .filter(word => word.confidence < 80)
      .map(word => ({
        text: word.text,
        confidence: word.confidence,
        bbox: word.bbox
      }));
  }
  
  if (ocrResult2.words) {
    analysis.lowConfidenceWords2 = ocrResult2.words
      .filter(word => word.confidence < 80)
      .map(word => ({
        text: word.text,
        confidence: word.confidence,
        bbox: word.bbox
      }));
  }
  
  // Find similar words with different recognition results
  // Simple approach: use difference character count as a proxy for similar words
  const dmp = new DiffMatchPatch();
  const wordSet1 = new Set(ocrResult1.words ? ocrResult1.words.map(w => w.text.toLowerCase()) : []);
  const wordSet2 = new Set(ocrResult2.words ? ocrResult2.words.map(w => w.text.toLowerCase()) : []);
  
  for (const word1 of wordSet1) {
    for (const word2 of wordSet2) {
      if (word1 !== word2) {
        const diffs = dmp.diff_main(word1, word2);
        const levenshtein = dmp.diff_levenshtein(diffs);
        
        // If words are similar but not identical
        if (levenshtein > 0 && levenshtein <= 2 && word1.length > 2 && word2.length > 2) {
          analysis.potentialMisreads.push({
            word1,
            word2,
            editDistance: levenshtein
          });
        }
      }
    }
  }
  
  return analysis;
};

// API to upload and compare documents
router.post("/compare", upload.array("files", 2), async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length < 2) {
      return res.status(400).json({ error: "Upload two files" });
    }

    const file1Path = files[0].path;
    const file2Path = files[1].path;
    const file1Ext = path.extname(files[0].originalname).toLowerCase();
    const file2Ext = path.extname(files[1].originalname).toLowerCase();

    let result1 = { text: "", isOcr: false };
    let result2 = { text: "", isOcr: false };

    // Extract text from first file
    if (file1Ext === ".docx") {
      result1 = await extractTextFromDocx(file1Path);
    } else if (file1Ext === ".pdf") {
      result1 = await extractTextFromPdf(file1Path);
    } else if ([".jpg", ".jpeg", ".png"].includes(file1Ext)) {
      result1 = await extractTextFromImage(file1Path);
    } else {
      return res.status(400).json({ error: "Unsupported file type for first document" });
    }

    // Extract text from second file
    if (file2Ext === ".docx") {
      result2 = await extractTextFromDocx(file2Path);
    } else if (file2Ext === ".pdf") {
      result2 = await extractTextFromPdf(file2Path);
    } else if ([".jpg", ".jpeg", ".png"].includes(file2Ext)) {
      result2 = await extractTextFromImage(file2Path);
    } else {
      return res.status(400).json({ error: "Unsupported file type for second document" });
    }

    if (!result1.text || !result2.text) {
      return res.status(400).json({ error: "Failed to extract text from one or both files" });
    }

    const differences = compareText(result1.text, result2.text);
    
    // Calculate statistics about the differences
    let addedChars = 0;
    let removedChars = 0;
    let unchangedChars = 0;
    
    differences.forEach(([op, data]) => {
      if (op === 1) addedChars += data.length;      // Added
      else if (op === -1) removedChars += data.length;  // Removed
      else unchangedChars += data.length;           // Unchanged
    });
    
    const totalChars = addedChars + removedChars + unchangedChars;
    const diffPercentage = ((addedChars + removedChars) / totalChars * 100).toFixed(2);
    
    // Prepare the response object
    const response = {
      text1: result1.text,
      text2: result2.text,
      differences,
      stats: {
        addedChars,
        removedChars,
        unchangedChars,
        totalChars,
        diffPercentage
      }
    };
    
    // If both documents were processed with OCR, include OCR-specific analysis
    if (result1.isOcr && result2.isOcr) {
      response.ocrAnalysis = analyzeOcrDifferences(result1, result2);
    }

    res.json(response);

    // Delete uploaded files after processing
    try {
      fs.unlinkSync(file1Path);
      fs.unlinkSync(file2Path);
    } catch (deleteError) {
      console.error("Error deleting temporary files:", deleteError);
    }
  } catch (error) {
    console.error("Error in compare endpoint:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred" });
  }
});

export default router;