import express from 'express'
import cors from 'cors'
import uploadRouter from './routes/upload.js'
import audioPlayerRouter from './routes/audioPlayer.js'
const app = express()
const PORT = 5001

app.use(cors())
app.use(express.json())

app.use('/api', audioPlayerRouter)
app.use('/api/uploads', uploadRouter)

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`)
})
