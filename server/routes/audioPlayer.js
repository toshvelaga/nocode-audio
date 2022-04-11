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

export default router
