import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import crypto from 'crypto';

// Calculate hash for a file to determine if content has changed
const calculateFileHash = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
};

// Get file metadata
const getFileMetadata = (filePath) => {
  const stats = fs.statSync(filePath);
  return {
    size: stats.size,
    lastModified: stats.mtime
  };
};

// Recursive function to get all files with metadata in a folder
const getFilesWithMetadata = (dir, baseDir) => {
  let results = [];
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      results = [...results, ...getFilesWithMetadata(fullPath, baseDir)];
    } else {
      // Get relative path from base directory
      const relativePath = path.relative(baseDir, fullPath);
      results.push({
        path: fullPath,
        file: relativePath,
        size: stat.size,
        lastModified: stat.mtime,
        hash: calculateFileHash(fullPath)
      });
    }
  });

  return results;
};

// Compare two folders with detailed information
export const compareFolders = (req, res) => {
  try {
    const [folder1Path, folder2Path] = req.files.map(file => file.path);
    
    // Get metadata for source directories
    const folder1Stats = fs.statSync(folder1Path);
    const folder2Stats = fs.statSync(folder2Path);
    
    const folder1Name = path.basename(folder1Path);
    const folder2Name = path.basename(folder2Path);
    
    // Get all files with metadata from both folders
    const files1 = getFilesWithMetadata(folder1Path, folder1Path);
    const files2 = getFilesWithMetadata(folder2Path, folder2Path);
    
    // Create lookup maps for easier comparison
    const files1Map = new Map(files1.map(f => [f.file, f]));
    const files2Map = new Map(files2.map(f => [f.file, f]));
    
    // Find removed, added, changed and unchanged files
    const removed = [];
    const added = [];
    const changed = [];
    const unchanged = [];
    
    // Check for removed and changed files
    files1.forEach(file1 => {
      const file2 = files2Map.get(file1.file);
      
      if (!file2) {
        // File exists in folder1 but not in folder2
        removed.push({
          file: file1.file,
          size1: file1.size,
          lastModified1: file1.lastModified
        });
      } else if (file1.hash !== file2.hash) {
        // File exists in both folders but content is different
        changed.push({
          file: file1.file,
          size1: file1.size,
          size2: file2.size,
          lastModified1: file1.lastModified,
          lastModified2: file2.lastModified
        });
      } else {
        // File exists in both folders and content is the same
        unchanged.push({
          file: file1.file,
          size1: file1.size,
          size2: file2.size,
          lastModified1: file1.lastModified,
          lastModified2: file2.lastModified
        });
      }
    });
    
    // Check for added files
    files2.forEach(file2 => {
      if (!files1Map.has(file2.file)) {
        // File exists in folder2 but not in folder1
        added.push({
          file: file2.file,
          size2: file2.size,
          lastModified2: file2.lastModified
        });
      }
    });
    
    // Clean up uploaded folders
    fs.rmSync(folder1Path, { recursive: true, force: true });
    fs.rmSync(folder2Path, { recursive: true, force: true });
    
    res.json({
      source1: {
        name: folder1Name,
        size: folder1Stats.size
      },
      source2: {
        name: folder2Name,
        size: folder2Stats.size
      },
      removed,
      added,
      changed,
      unchanged
    });
  } catch (error) {
    console.error('Error comparing folders:', error);
    res.status(500).json({ message: error.message });
  }
};

// Compare two ZIP files with detailed information
export const compareZipFiles = (req, res) => {
  try {
    const [zip1Path, zip2Path] = req.files.map(file => file.path);
    const tempDir1 = path.join('temp', 'extracted1_' + Date.now());
    const tempDir2 = path.join('temp', 'extracted2_' + Date.now());
    
    // Ensure the temp directories exist
    fs.mkdirSync(tempDir1, { recursive: true });
    fs.mkdirSync(tempDir2, { recursive: true });
    
    // Get ZIP file information
    const zip1Stats = fs.statSync(zip1Path);
    const zip2Stats = fs.statSync(zip2Path);
    
    const zip1Name = path.basename(zip1Path);
    const zip2Name = path.basename(zip2Path);
    
    // Extract ZIP files
    const zip1 = new AdmZip(zip1Path);
    const zip2 = new AdmZip(zip2Path);
    
    zip1.extractAllTo(tempDir1, true);
    zip2.extractAllTo(tempDir2, true);
    
    // Get all files with metadata from both extracted folders
    const files1 = getFilesWithMetadata(tempDir1, tempDir1);
    const files2 = getFilesWithMetadata(tempDir2, tempDir2);
    
    // Create lookup maps for easier comparison
    const files1Map = new Map(files1.map(f => [f.file, f]));
    const files2Map = new Map(files2.map(f => [f.file, f]));
    
    // Find removed, added, changed and unchanged files
    const removed = [];
    const added = [];
    const changed = [];
    const unchanged = [];
    
    // Check for removed and changed files
    files1.forEach(file1 => {
      const file2 = files2Map.get(file1.file);
      
      if (!file2) {
        // File exists in zip1 but not in zip2
        removed.push({
          file: file1.file,
          size1: file1.size,
          lastModified1: file1.lastModified
        });
      } else if (file1.hash !== file2.hash) {
        // File exists in both zips but content is different
        changed.push({
          file: file1.file,
          size1: file1.size,
          size2: file2.size,
          lastModified1: file1.lastModified,
          lastModified2: file2.lastModified
        });
      } else {
        // File exists in both zips and content is the same
        unchanged.push({
          file: file1.file,
          size1: file1.size,
          size2: file2.size,
          lastModified1: file1.lastModified,
          lastModified2: file2.lastModified
        });
      }
    });
    
    // Check for added files
    files2.forEach(file2 => {
      if (!files1Map.has(file2.file)) {
        // File exists in zip2 but not in zip1
        added.push({
          file: file2.file,
          size2: file2.size,
          lastModified2: file2.lastModified
        });
      }
    });
    
    // Clean up temporary directories and uploaded ZIP files
    fs.rmSync(tempDir1, { recursive: true, force: true });
    fs.rmSync(tempDir2, { recursive: true, force: true });
    fs.unlinkSync(zip1Path);
    fs.unlinkSync(zip2Path);
    
    res.json({
      source1: {
        name: zip1Name,
        size: zip1Stats.size
      },
      source2: {
        name: zip2Name,
        size: zip2Stats.size
      },
      removed,
      added,
      changed,
      unchanged
    });
  } catch (error) {
    console.error('Error comparing ZIP files:', error);
    res.status(500).json({ message: error.message });
  }
};