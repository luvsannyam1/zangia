const multer = require("multer");
const path = require("path");

// Set storage engine for multer (destination folder and filename format)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/"); // Folder where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file to avoid overwriting
  },
});

// Check file type (allow images and videos)
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif|mp4|avi|mkv/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); // Accept the file
  } else {
    cb(new Error("Only image and video files are allowed!"), false); // Reject non-image and non-video files
  }
};

// Initialize multer with storage settings and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // Set a size limit (100MB in this case)
});

module.exports = upload;
