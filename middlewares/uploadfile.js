const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

var s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
var storage = multer({
  storage: multerS3({
    s3: s3,
    ACL: 'public-read',
    bucket: process.env.AWS_BUCKET,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now() + '--' + file.originalname);
    },
  }),
});

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './public');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '--' + file.originalname);
//   },
// });

// const uploadFiles = multer({ storage: storage });

const uploadFiles = multer(storage);

module.exports = {
  uploadFiles,
};
