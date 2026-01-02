// FILE: backend/utils/uploadConfig.js
// 🔐 Secure File Upload System - Organized by Host ID & Name

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ==================== HELPER: CREATE FOLDERS ====================
const createUploadFolders = (hostId, hostName, type) => {
  const sanitizedName = hostName.replace(/[^a-zA-Z0-9]/g, "_");
  const folderName = `${hostId}-${sanitizedName}`;
  const basePath = path.join(__dirname, "..", "uploads", type, folderName);

  // Create folder if it doesn't exist
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
    console.log(`✅ Created folder: uploads/${type}/${folderName}`);
  }

  return { basePath, folderName };
};

// ==================== HELPER: GENERATE UNIQUE FILENAME ====================
const generateFilename = (originalname, prefix = "") => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const ext = path.extname(originalname);
  const baseName = path
    .basename(originalname, ext)
    .replace(/[^a-zA-Z0-9]/g, "_");

  return `${prefix}${baseName}-${timestamp}-${randomString}${ext}`;
};

// ==================== IMAGE UPLOAD CONFIGURATION ====================
const createImageStorage = () => {
  return multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        const hostId = req.user.userId;
        const hostName = req.hostName || "Unknown"; // Set by middleware

        const { basePath } = createUploadFolders(hostId, hostName, "images");
        cb(null, basePath);
      } catch (error) {
        console.error("❌ Image storage destination error:", error);
        cb(error);
      }
    },
    filename: (req, file, cb) => {
      const filename = generateFilename(file.originalname, "image-");
      cb(null, filename);
    },
  });
};

// ==================== VIDEO UPLOAD CONFIGURATION ====================
const createVideoStorage = () => {
  return multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        const hostId = req.user.userId;
        const hostName = req.hostName || "Unknown";

        const { basePath } = createUploadFolders(hostId, hostName, "videos");
        cb(null, basePath);
      } catch (error) {
        console.error("❌ Video storage destination error:", error);
        cb(error);
      }
    },
    filename: (req, file, cb) => {
      const filename = generateFilename(file.originalname, "video-");
      cb(null, filename);
    },
  });
};

// ==================== DOCUMENT UPLOAD CONFIGURATION ====================
const createDocumentStorage = () => {
  return multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        const hostId = req.user.userId;
        const hostName = req.hostName || "Unknown";

        const { basePath } = createUploadFolders(hostId, hostName, "documents");
        cb(null, basePath);
      } catch (error) {
        console.error("❌ Document storage destination error:", error);
        cb(error);
      }
    },
    filename: (req, file, cb) => {
      // Use field name for documents (e.g., aadhaarFront, voterBack)
      const fieldName = file.fieldname;
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      const filename = `${fieldName}-${timestamp}${ext}`;
      cb(null, filename);
    },
  });
};

// ==================== FILE FILTERS ====================
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
};

const videoFilter = (req, file, cb) => {
  const allowedTypes = /mp4|webm|avi|mov|mkv/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = /video/.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only video files are allowed (mp4, webm, avi, mov, mkv)"));
};

const documentFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = /image|pdf/.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only image or PDF files are allowed for documents"));
};

// ==================== MULTER CONFIGURATIONS ====================
const uploadImage = multer({
  storage: createImageStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter,
});

const uploadVideo = multer({
  storage: createVideoStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: videoFilter,
});

const uploadDocument = multer({
  storage: createDocumentStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: documentFilter,
});

// ==================== UTILITY: GET RELATIVE PATH ====================
/**
 * Convert absolute file path to relative path for database storage
 * Example: /app/uploads/images/123-JohnDoe/image-123.jpg -> /uploads/images/123-JohnDoe/image-123.jpg
 */
const getRelativePath = (absolutePath) => {
  const uploadsIndex = absolutePath.indexOf("uploads");
  if (uploadsIndex === -1) return absolutePath;
  return "/" + absolutePath.substring(uploadsIndex).replace(/\\/g, "/");
};

// ==================== UTILITY: DELETE FILE ====================
const deleteFile = (filePath) => {
  try {
    const absolutePath = path.join(__dirname, "..", filePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log(`🗑️ Deleted file: ${filePath}`);
      return true;
    }
  } catch (error) {
    console.error("❌ Delete file error:", error);
  }
  return false;
};

// ==================== UTILITY: DELETE HOST FOLDER ====================
const deleteHostFolder = (hostId, hostName, type) => {
  try {
    const sanitizedName = hostName.replace(/[^a-zA-Z0-9]/g, "_");
    const folderName = `${hostId}-${sanitizedName}`;
    const folderPath = path.join(__dirname, "..", "uploads", type, folderName);

    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log(`🗑️ Deleted folder: uploads/${type}/${folderName}`);
      return true;
    }
  } catch (error) {
    console.error("❌ Delete folder error:", error);
  }
  return false;
};

module.exports = {
  uploadImage,
  uploadVideo,
  uploadDocument,
  getRelativePath,
  deleteFile,
  deleteHostFolder,
  createUploadFolders,
};
