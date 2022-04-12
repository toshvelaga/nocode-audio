import express from 'express'
import pool from '../db.js'
const router = express.Router()

router.get('/audio-player/:id', async (req, res) => {
  const audioPlayerId = req.params.id

  const playerData = await pool.query(
    `SELECT * FROM audio_player WHERE audio_player.player_id = $1`,
    [audioPlayerId]
  )
  console.log(playerData.rows[0])
  return res.json(playerData.rows[0])
})

router.post('/audio-player', async (req, res) => {
  const {
    title,
    subtitle,
    backgroundColor,
    progressBarColor,
    fontColor,
    audioUrl,
    imageUrl,
  } = req.body
  //   const title = 'hello'
  //   const subtitle = 'world'
  //   const backgroundColor = 'purple'

  const newAudioPlayer = await pool.query(
    'INSERT INTO audio_player (title, subtitle, background_color, progress_bar_color, font_color, audio_url, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [
      title,
      subtitle,
      backgroundColor,
      progressBarColor,
      fontColor,
      audioUrl,
      imageUrl,
    ]
  )

  const newAudioPlayerId = newAudioPlayer.rows[0].player_id

  console.log(newAudioPlayer.rows[0])
  return res.json({ id: newAudioPlayerId })
})

export default router
