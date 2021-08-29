const express = require('express');
const routes = express.Router();
// multer as a middleware handling multipart/form-data
const multer = require('multer');
const AWS = require('aws-sdk');
const router = require('./user-routes');
const paramsConfig = require('../utils/params-config');

// Use 'multer' to create a temporary storage container that will hold the image until uploaded to bucket
const storage = multer.memoryStorage ({
    destination: function(req, file, callback) {
        callback(null,'')
    }
})

// Function to store the image data from form-data (HTML form objects) from POST route\
// 'single' method to define upload only receive one image
// define the key as 'image'
const upload = multer({storage}).single('image');

// Initiate S3 service object
const s3 = new AWS.S3({
    apiVersion: '2006-03-01' // lock the version number as a precautionary measure in case the default S3 version changes
  })

router.post('/image-upload', upload, (req, res) => { // 'upload' function to define the key and storage destination
    // set up params config
    const params = paramsConfig(req.file);
    // set up S3 service call - upload
    s3.upload(params, (err, data) => {
        if(err) {
            console.log(err);
            res.status(500).send(err)
        }
        console.log("this is....", data)
        res.json(data)
    })
})

module.exports = router;