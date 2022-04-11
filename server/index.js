import express from 'express'
import uploadRouter from './routes/upload.js'
import audioPlayerRouter from './routes/audioPlayer.js'
const app = express()
const PORT = 5001

app.use('/', audioPlayerRouter)
app.use('/uploads', uploadRouter)

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`)
})
