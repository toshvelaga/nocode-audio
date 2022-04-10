import React, { useState, useEffect, useRef } from 'react'
// import './AudioWidget.css';
// import { useParams } from 'react-router-dom';
import axios from 'axios'
// import * as BsIcons from 'react-icons/bs';
import Slider from '../../components/Slider/Slider'
import ControlPanel from '../../components/Controls/ControlPanel'
// import Button from '../../components/Controls/Button'
import Draggable from 'react-draggable'

import './AudioWidget.css'

function AudioWidget() {
  const [percentage, setPercentage] = useState()
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState()
  const [speed, setSpeed] = useState(1)
  const [counted, setCounted] = useState(false)

  const [colorPicker, setcolorPicker] = useState('#ff0000')

  const audioRef = useRef()
  const imgUrl = 'https://i.ibb.co/98ck5mT/aaron.jpg'
  const audio = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

  const onChange = (e) => {
    const audio = audioRef.current
    audio.currentTime = (audio.duration / 100) * e.target.value
    setPercentage(e.target.value)
  }

  const play = () => {
    const audio = audioRef.current
    // audio.playbackRate = speed;
    audio.volume = 0.1

    if (!counted) {
      console.log('clicked')
      incListenCount()
      setCounted(true)
    }

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

  const incListenCount = () => {
    // axios
    //   .patch(`/api/update/episodes/${id}/views`)
    //   .then((res) => console.log(res))
    console.log('listen count incremented')
  }

  const incListenCompleted = () => {
    // axios
    //   .patch(`/api/update/episodes/${id}/views/completed`)
    //   .then((res) => console.log(res))
    console.log('listen completed incremented')
  }

  useEffect(() => {
    const audio = audioRef.current
    audio.playbackRate = speed

    audio.onended = function () {
      incListenCompleted()
    }
  }, [speed])

  return (
    <>
      <div style={{ marginTop: '2rem' }}>
        <label for='favcolor'>Change background color: </label>
        <input
          type='color'
          id='favcolor'
          name='favcolor'
          value={colorPicker}
          onChange={(e) => setcolorPicker(e.target.value)}
        ></input>
      </div>
      <div
        style={{
          backgroundColor: `${colorPicker}`,
          width: '60%',
          margin: '2rem auto',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        className='embed-audio-container'
      >
        <Draggable>
          <img
            width='150px'
            draggable='false'
            className='podcast-image'
            src={imgUrl}
            style={{ borderRadius: '5px' }}
          />
        </Draggable>
        {/* <img width='200px' className='podcast-image' src={imgUrl} /> */}
        <div className='podcast-info'>
          <h3 contenteditable='true' style={{ marginBottom: '.3em' }}>
            Episode Title
          </h3>
          <p
            style={{
              marginBottom: '.3em',
              fontWeight: 200,
            }}
          >
            podcast title
          </p>

          <div>
            <Slider percentage={percentage} onChange={onChange} />
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
            <button onClick={play}>Play</button>
            {/* <Button play={play} isPlaying={isPlaying} /> */}
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
            src={audio}
          />
        </div>
      </div>
    </>
  )
}

export default AudioWidget
