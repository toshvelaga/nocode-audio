import express from 'express'
import uploadRouter from './routes/upload.js'
const app = express()
const PORT = 1337

app.use('/uploads', uploadRouter)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})
