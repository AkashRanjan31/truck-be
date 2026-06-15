const multer = require('multer');
const path = require('path');

const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'reportPhoto' || file.fieldname === 'photo') {
      cb(null, 'uploads/reports/');
    } else if (file.fieldname === 'profilePicture') {
      cb(null, 'uploads/profiles/');
    } else {
      cb(null, 'uploads/');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const uploadMiddleware = multer({
  storage: uploadStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

module.exports = uploadMiddleware;
