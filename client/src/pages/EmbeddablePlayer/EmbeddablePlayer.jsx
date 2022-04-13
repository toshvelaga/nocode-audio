import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import API from '../../api/api'
import Player from '../../components/Player/Player'

const EmbeddablePlayer = () => {
  const { id } = useParams()

  const [playerData, setplayerData] = useState({
    backgroundColor: '',
    progressBarColor: '',
    fontColor: '',
    mainTitle: '',
    subtitle: '',
    imgUrl: '',
    audioUrl: '',
  })

  useEffect(() => {
    API.get(`audio-player/${id}`)
      .then((res) => {
        const {
          background_color,
          play_button_color,
          progress_bar_color,
          font_color,
          title,
          subtitle,
          audio_url,
          image_url,
        } = res.data

        setplayerData({
          backgroundColor: background_color,
          playBtnColor: play_button_color,
          progressBarColor: progress_bar_color,
          fontColor: font_color,
          title: title,
          subtitle: subtitle,
          imgUrl: image_url,
          audioUrl: audio_url,
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <>
      <Player
        backgroundColor={playerData.backgroundColor}
        imgUrl={playerData.imgUrl}
        playBtnColor={playerData.playBtnColor}
        fontColor={playerData.fontColor}
        title={playerData.title}
        subtitle={playerData.subtitle}
        progressBarColor={playerData.progressBarColor}
        audioUrl={playerData.audioUrl}
      />
    </>
  )
}

export default EmbeddablePlayer
