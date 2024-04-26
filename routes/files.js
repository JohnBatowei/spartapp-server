const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        // Generate a unique filename
        const uniqueFilename = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueFilename);
    }
});


const upload = multer({
    storage: fileStorageEngine,
    // limits: {
    //     fileSize: 10 * 1024 * 1024 // 10 MB limit
    // },
    fileFilter: (req, file, cb) => {
        // Check file type
        const allowedFileTypes = /jpeg|jpg|png|giff/;
        const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedFileTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});


module.exports = upload;
