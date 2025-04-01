import express from 'express';
import multer from 'multer';
import { compareFolders, compareZipFiles } from '../controllers/folderController.js';

const router = express.Router();
const upload = multer({ dest: 'temp/uploads/' }); // Temporary upload directory

// Route for comparing folders
router.post('/compare/folders', upload.array('folders', 2), compareFolders);

// Route for comparing ZIP files
router.post('/compare/zip', upload.array('zips', 2), compareZipFiles);

export default router;
