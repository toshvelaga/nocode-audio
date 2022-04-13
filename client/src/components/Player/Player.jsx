import React, { useState, useEffect, useRef } from 'react'
import { BsArrowClockwise, BsArrowCounterclockwise } from 'react-icons/bs'
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa'
import Slider from '../Slider/Slider'
import ControlPanel from '../Controls/ControlPanel'
import './Player.css'

const Player = (props) => {
  const [percentage, setPercentage] = useState()
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState()
  const [speed, setSpeed] = useState(1)
  const audioRef = useRef()

  useEffect(() => {
    const audio = audioRef.current
    audio.playbackRate = speed
  }, [speed])

  const onChange = (e) => {
    const audio = audioRef.current
    audio.currentTime = (audio.duration / 100) * e.target.value
    setPercentage(e.target.value)
  }

  const play = () => {
    const audio = audioRef.current
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

  return (
    <div
      style={{
        backgroundColor: `${props.backgroundColor}`,
      }}
      className='embed-audio-container'
    >
      <img draggable='false' className='podcast-image' src={props.imgUrl} />
      <div className='podcast-info'>
        <div className='controls-container'>
          <button className='play-button' onClick={play}>
            {!isPlaying ? (
              <FaPlayCircle color={props.playBtnColor} size={70} />
            ) : (
              <FaPauseCircle color={props.playBtnColor} size={70} />
            )}
          </button>
          <div
            style={{
              width: '100%',
              marginTop: '.25rem',
            }}
          >
            <textarea
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                width: '100%',
                fontSize: '16px',
                fontWeight: 400,
                resize: 'none',
                color: `${props.fontColor}`,
              }}
              maxLength='40'
              value={props.title}
              rows='1'
              // onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                width: '100%',
                fontSize: '16px',
                fontWeight: 400,
                resize: 'none',
                color: `${props.fontColor}`,
              }}
              maxLength='85'
              value={props.subtitle}
              //   onChange={(e) => setsubtitle(e.target.value)}
            />
          </div>
        </div>
        <div style={{ marginTop: '.5rem' }}>
          <Slider
            backgroundColor={props.progressBarColor}
            percentage={percentage}
            onChange={onChange}
          />
          <div>
            <ControlPanel
              play={play}
              isPlaying={isPlaying}
              duration={duration}
              currentTime={currentTime}
              style={{ color: props.fontColor }}
            />
          </div>
        </div>
        <div className='bottom-controls-container'>
          <button className='skip-buttons' onClick={() => skip('back')}>
            <BsArrowCounterclockwise color='#535353' size={22} />
          </button>
          <button className='speed-button' onClick={() => changeSpeed()}>
            {speed}x
          </button>
          <button className='skip-buttons' onClick={() => skip('fwd')}>
            <BsArrowClockwise color='#535353' size={22} />
          </button>
        </div>
        <audio
          ref={audioRef}
          onTimeUpdate={getCurrDuration}
          onLoadedData={(e) => {
            setDuration(e.currentTarget.duration.toFixed(2))
          }}
          src={props.audioUrl}
        />
      </div>
    </div>
  )
}

export default Player
