import express from 'express'
import AWS from 'aws-sdk'
import multer from 'multer'
import sharp from 'sharp'
import { uuid } from 'uuidv4'
import 'dotenv/config'

const router = express.Router()

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
})

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, '')
  },
})

const upload = multer({ storage }).single('image')
// const upload = multer({ storage }).array('file') // for multiple files
const audioupload = multer().single('audio')

// upload image
router.post('/images', upload, async (req, res) => {
  const myFile = req.file.originalname.split('.')
  const fileType = myFile[myFile.length - 1]

  const resizedFile = await sharp(req.file.buffer).resize(200, 200)

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `cover_artwork/${uuid()}.${fileType}`,
    Body: resizedFile,
  }

  s3.upload(params, (error, data) => {
    if (error) {
      res.status(401).json({
        image: "Error occured while uploading image. Don't leave blank",
      })
    }

    res.status(200).send(data)
  })
})

// upload audio
router.post('/audio', audioupload, (req, res) => {
  const myFile = req.file.originalname.split('.')
  const fileType = myFile[myFile.length - 1]

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `audio/${uuid()}.${fileType}`,
    Body: req.file.buffer,
  }

  s3.upload(params, (error, data) => {
    if (error) {
      res.status(500).send(error)
    } else res.status(200).send(data)
  })
})

export default router
