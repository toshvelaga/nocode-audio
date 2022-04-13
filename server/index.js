const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 5001

const uploadRouter = require('./routes/upload')
const audioPlayerRouter = require('./routes/audioPlayer')

app.use(cors())
app.use(express.json())

app.use('/api', audioPlayerRouter)
app.use('/api/uploads', uploadRouter)

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`)
})
