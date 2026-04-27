const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/files');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1E9);

        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);

        cb(null, name + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage });

module.exports = { upload };