
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req,file, cb)=>{
        cb(null, 'uploads/articles');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image/')){
        cb(null , true);
    }else{
        cb(new Error('only image file are allowed'), false);
    }
};

exports.uploadArtilceImage = multer({
    storage,
    fileFilter,
    limits: {fileSize: 5*1024*1024}
});
