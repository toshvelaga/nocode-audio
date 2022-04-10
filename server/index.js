import express from 'express'
const app = express()

const PORT = 1337

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log('Example app listening on port 3000!')
})