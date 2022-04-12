import React, { useState, useEffect, useRef } from 'react'
import API from '../../api/api'
import { BsArrowClockwise, BsArrowCounterclockwise } from 'react-icons/bs'
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa'
import Slider from '../../components/Slider/Slider'
import ControlPanel from '../../components/Controls/ControlPanel'
// import Button from '../../components/Controls/Button'
import './CustomizePlayer.css'
import Navbar from '../../components/Navbar/Navbar'

function CustomizePlayer() {
  const [percentage, setPercentage] = useState()
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState()
  const [speed, setSpeed] = useState(1)

  const [backgroundColor, setBackgroundColor] = useState('#f1f1f1')
  const [playBtnColor, setplayBtnColor] = useState('grey')
  const [progressBarColor, setProgressBarColor] = useState('#1bb953')
  const [fontColor, setfontColor] = useState('#1bb953')

  const [title, setTitle] = useState('The Story of Aaron Schwartz')
  const [subtitle, setsubtitle] = useState(
    'Hacktivism and the limits of Open Source'
  )
  const [imgUrl, setimgUrl] = useState('https://i.ibb.co/98ck5mT/aaron.jpg')
  const [audioUrl, setaudio] = useState(
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  )
  const [embedUrl, setembedUrl] = useState('')
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

  const submitHandler = () => {
    API.post('audio-player', {
      title: 'The Story of Aaron Schwartz',
      subtitle,
      backgroundColor,
      progressBarColor,
      fontColor,
      audioUrl,
      imageUrl: imgUrl,
    })
      .then((res) => {
        setembedUrl(res.data.id)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <>
      <Navbar>
        <div style={{ marginTop: '2rem' }}>
          <div className='navbar-inputs'>
            <label for='favcolor'>Background color: </label>
            <input
              type='color'
              id='backgroundColor'
              name='backgroundColor'
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
            ></input>
          </div>

          <div className='navbar-inputs'>
            <label for='favcolor'>Play button color: </label>
            <input
              type='color'
              id='playBtnColor'
              name='playBtnColor'
              value={playBtnColor}
              onChange={(e) => setplayBtnColor(e.target.value)}
            ></input>
          </div>

          <div className='navbar-inputs'>
            <label for='favcolor'>Progress bar color: </label>
            <input
              type='color'
              id='progressColor'
              name='progressColor'
              value={progressBarColor}
              onChange={(e) => setProgressBarColor(e.target.value)}
            ></input>
          </div>

          <div className='navbar-inputs'>
            <label for='favcolor'>Font color: </label>
            <input
              type='color'
              id='fontColor'
              name='fontColor'
              value={fontColor}
              onChange={(e) => setfontColor(e.target.value)}
            ></input>
          </div>

          <div className='upload-file-button'>
            <label style={{ width: '100%' }} for='avatar'>
              Upload image
            </label>
            <input
              type='file'
              id='avatar'
              name='avatar'
              accept='image/png, image/jpeg'
              onChange={(e) => {
                console.log(e.target.files[0])
                setimgUrl(URL.createObjectURL(e.target.files[0]))
              }}
            ></input>
          </div>

          <div className='upload-file-button'>
            <label for='audio'>Upload audio</label>
            <input
              type='file'
              id='audio'
              name='audio'
              accept='audio/*'
              onChange={(e) => {
                console.log(e.target.files[0])
                setaudio(URL.createObjectURL(e.target.files[0]))
              }}
            ></input>
          </div>

          <button className='submit-button' onClick={submitHandler}>
            Submit
          </button>
        </div>
      </Navbar>

      <div
        style={{
          backgroundColor: `${backgroundColor}`,
          width: '60%',
          borderRadius: '5px',
          cursor: 'pointer',
          marginLeft: '330px',
          marginTop: '5rem',
        }}
        className='embed-audio-container'
      >
        <img draggable='false' className='podcast-image' src={imgUrl} />
        <div style={{ border: '1px solid purple' }} className='podcast-info'>
          <div className='controls-container'>
            <button
              style={{ border: '1px solid red' }}
              className='play-button'
              onClick={play}
            >
              {!isPlaying ? (
                <FaPlayCircle color={playBtnColor} size={70} />
              ) : (
                <FaPauseCircle color={playBtnColor} size={70} />
              )}
            </button>
            <div style={{ border: '1px solid red', width: '70%' }}>
              <h3
                contenteditable='true'
                style={{ marginBottom: '.3em', marginTop: 0, color: fontColor }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontWeight: 400,
                  marginTop: 0,
                  color: fontColor,
                }}
              >
                {subtitle}
              </p>
            </div>
          </div>
          <div>
            <Slider
              backgroundColor={progressBarColor}
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
            src={audioUrl}
          />
        </div>
      </div>
      {embedUrl && <p>{embedUrl}</p>}
    </>
  )
}

export default CustomizePlayer
