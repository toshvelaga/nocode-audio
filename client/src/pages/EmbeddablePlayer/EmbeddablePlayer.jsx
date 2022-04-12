import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import API from '../../api/api'
// import * as BsIcons from 'react-icons/bs';
import Slider from '../../components/Slider/Slider'
import ControlPanel from '../../components/Controls/ControlPanel'
// import Button from '../../components/Controls/Button'
// import playBtn from '../../assets/play.svg'

const EmbeddablePlayer = () => {
  const { id } = useParams()

  const [percentage, setPercentage] = useState()
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState()
  const [speed, setSpeed] = useState(1)

  const [playerData, setplayerData] = useState({
    backgroundColor: '',
    progressBarColor: '',
    fontColor: '',
    mainTitle: '',
    subtitle: '',
    imgUrl: '',
    audioUrl: '',
  })

  const audioRef = useRef()

  const onChange = (e) => {
    const audio = audioRef.current
    audio.currentTime = (audio.duration / 100) * e.target.value
    setPercentage(e.target.value)
  }

  const play = () => {
    const audio = audioRef.current
    // audio.playbackRate = speed;
    audio.volume = 0.1

    if (!isPlaying) {
      setIsPlaying(true)
      audio.play()
    }

    if (isPlaying) {
      setIsPlaying(false)
      audio.pause()
    }
  }

  const getCurrDuration = (e) => {
    const percent = (
      (e.currentTarget.currentTime / e.currentTarget.duration) *
      100
    ).toFixed(2)

    const time = e.currentTarget.currentTime

    setPercentage(+percent)
    setCurrentTime(time.toFixed(2))
  }

  const changeSpeed = () => {
    if (speed >= 2) {
      setSpeed(0.5)
    } else setSpeed(speed + 0.5)
  }

  const skip = (time) => {
    const audio = audioRef.current

    if (time == 'back') {
      console.log('15')
      audio.currentTime -= 15
    } else if (time == 'fwd') {
      console.log('15')
      audio.currentTime += 15
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    audio.playbackRate = speed
  }, [speed])

  useEffect(() => {
    API.get(`audio-player/${id}`)
      .then((res) => {
        const {
          background_color,
          progress_bar_color,
          font_color,
          title,
          subtitle,
          audio_url,
          image_url,
        } = res.data

        setplayerData({
          backgroundColor: background_color,
          progressBarColor: progress_bar_color,
          fontColor: font_color,
          mainTitle: title,
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
      <div
        style={{
          backgroundColor: `${playerData.backgroundColor}`,
          width: '100%',
          margin: '2rem auto',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        className='embed-audio-container'
      >
        <img
          draggable='false'
          className='podcast-image'
          src={playerData.imgUrl}
        />
        <div style={{ border: '1px solid yellow' }} className='podcast-info'>
          <div className='controls-container'>
            <button
              style={{ border: '1px solid red' }}
              className='play-button'
              onClick={play}
            >
              <img src={playBtn} />
            </button>
            <div style={{ border: '1px solid red', width: '70%' }}>
              <h3
                contenteditable='true'
                style={{
                  marginBottom: '.3em',
                  marginTop: 0,
                  color: playerData.fontColor,
                }}
              >
                {playerData.mainTitle}
              </h3>
              <p
                style={{
                  fontWeight: 400,
                  marginTop: 0,
                  color: playerData.fontColor,
                }}
              >
                {playerData.subtitle}
              </p>
            </div>
          </div>
          <div>
            <Slider
              backgroundColor={playerData.progressBarColor}
              percentage={percentage}
              onChange={onChange}
            />
            <div>
              <ControlPanel
                play={play}
                isPlaying={isPlaying}
                duration={duration}
                currentTime={currentTime}
              />
            </div>
          </div>
          <div>
            <button className='skip-buttons' onClick={() => skip('back')}>
              back
              {/* <BsIcons.BsArrowCounterclockwise color='#535353' size={22} /> */}
            </button>
            <button className='speed-button' onClick={() => changeSpeed()}>
              {speed}x
            </button>
            <button className='skip-buttons' onClick={() => skip('fwd')}>
              fwd
              {/* <BsIcons.BsArrowClockwise color='#535353' size={22} /> */}
            </button>
          </div>
          <audio
            ref={audioRef}
            onTimeUpdate={getCurrDuration}
            onLoadedData={(e) => {
              setDuration(e.currentTarget.duration.toFixed(2))
            }}
            src={playerData.audio}
          />
        </div>
      </div>
    </>
  )
}

export default EmbeddablePlayer
