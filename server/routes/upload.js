const express = require('express'),
  router = express.Router(),
  AWS = require('aws-sdk'),
  multer = require('multer'),
  sharp = require('sharp'),
  { v4: uuidv4 } = require('uuid')

require('dotenv').config()

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
})

const upload = multer()

// upload image
router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400).send({
      error: 'No file uploaded',
    })
  } else {
    const myFile = req.file.originalname.split('.')
    const fileType = myFile[myFile.length - 1]

    const resizedFile = sharp(req.file.buffer).resize(200, 200)

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `cover_artwork/${uuidv4()}.${fileType}`,
      Body: resizedFile,
    }

    s3.upload(params, (error, data) => {
      if (error) {
        res.send(error)
      } else res.status(200).send(data)
    })
  }
})

// upload audio
router.post('/audio', upload.single('audio'), (req, res) => {
  if (!req.file) {
    res.status(400).send({
      error: 'No file uploaded',
    })
  } else {
    const myFile = req.file.originalname.split('.')
    const fileType = myFile[myFile.length - 1]

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `audio/${uuidv4()}.${fileType}`,
      Body: req.file.buffer,
    }

    s3.upload(params, (error, data) => {
      if (error) {
        res.send(error)
      } else res.status(200).send(data)
    })
  }
})

module.exports = router
