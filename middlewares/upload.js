const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
destination: (req, file, cb) => cb(null, 'uploads/'),
filename: (req, file, cb) => {
const name = Date.now() + path.extname(file.originalname);
cb(null, name);
}
});


function fileFilter(req, file, cb){
const allowed = /jpeg|jpg|png/;
const ext = allowed.test(path.extname(file.originalname).toLowerCase());
const mime = allowed.test(file.mimetype);
if(ext && mime) cb(null, true);
else cb(new Error('Only images are allowed'));
}


const upload = multer({
storage,
limits: { fileSize: 1024 * 1024 * 2 }, // 2MB
fileFilter
});


module.exports = upload;