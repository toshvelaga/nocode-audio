import express from 'express'
import uploadRouter from './routes/upload.js'
const app = express()
const PORT = 5001

app.use('/uploads', uploadRouter)

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`)
})
