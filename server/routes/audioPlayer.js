const express = require('express'),
  pool = require('../db'),
  router = express.Router()

router.get('/audio-player/:id', async (req, res) => {
  const audioPlayerId = req.params.id

  const playerData = await pool.query(
    `SELECT * FROM audio_player WHERE audio_player.player_id = $1`,
    [audioPlayerId]
  )
  res.status(200).json(playerData.rows[0])
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
    playButtonColor,
  } = req.body

  const newAudioPlayer = await pool.query(
    'INSERT INTO audio_player (title, subtitle, background_color, progress_bar_color, font_color, audio_url, image_url, play_button_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [
      title,
      subtitle,
      backgroundColor,
      progressBarColor,
      fontColor,
      audioUrl,
      imageUrl,
      playButtonColor,
    ]
  )

  const newAudioPlayerId = newAudioPlayer.rows[0].player_id

  res.status(201).json({ id: newAudioPlayerId })
})

module.exports = router
