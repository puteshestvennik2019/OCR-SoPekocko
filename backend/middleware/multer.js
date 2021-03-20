const multer = require('multer');
require('dotenv').config();

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// disk storage
const diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
    }
});

// memory storage ()
const memoryStorage = multer.memoryStorage();

module.exports = multer({storage: memoryStorage}).single('image');