const express = require('express');
const multer = require('multer');
const router = express.Router();
const RequestForProposal = require('./models/RequestForProposal'); // Path to your model

// Configure multer to use a disk storage engine, with custom file naming
// #TODO: Change this to store to aws s3 bucket instead of local disk in production:
// For that, first we need to npm install aws-sdk multer-s3
// Then, we need to configure aws-sdk with our credentials
// Then, we need to configure multer-s3 to use our s3 bucket
// Then, we need to configure multer to use multer-s3 as its storage engine
// Then, we need to configure multer to use our configured multer-s3 as its storage engine

// CODE: 
// const AWS = require('aws-sdk');
// const multer = require('multer');
// const multerS3 = require('multer-s3');

// AWS.config.update({
//     accessKeyId: 'your_access_key_id',
//     secretAccessKey: 'your_secret_access_key',
//     region: 'your_region'
// });

// const s3 = new AWS.S3();

// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'your_bucket_name',
//         metadata: function (req, file, cb) {
//             cb(null, {fieldName: file.fieldname});
//         },
//         key: function (req, file, cb) {
//             cb(null, Date.now().toString())
//         }
//     })
// });

// router.post('/rfp', upload.single('projectAttachments'), (req, res) => {
//     const newRfp = new RequestForProposal(req.body);
//     newRfp.projectAttachments = req.file.location; // Use the file URL provided by S3

//     newRfp.save()
//         .then(rfp => res.json(rfp))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

// module.exports = router;


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
})

const upload = multer({ storage: storage })

router.post('/rfp', upload.single('projectAttachments'), (req, res) => {
    const newRfp = new RequestForProposal(req.body);
    newRfp.projectAttachments = req.file.path;

    newRfp.save()
        .then(rfp => res.json(rfp))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
