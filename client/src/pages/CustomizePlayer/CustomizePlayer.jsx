import React, { useState, useEffect, useRef } from 'react'
import API from '../../api/api'
import { BsArrowClockwise, BsArrowCounterclockwise } from 'react-icons/bs'
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa'
import Slider from '../../components/Slider/Slider'
import ControlPanel from '../../components/Controls/ControlPanel'
import Navbar from '../../components/Navbar/Navbar'
import NavbarInput from '../../components/Navbar/NavbarInput'
import constants from '../../constants/constants'
import './CustomizePlayer.css'

function CustomizePlayer() {
  const [percentage, setPercentage] = useState()
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState()
  const [speed, setSpeed] = useState(1)

  const [backgroundColor, setBackgroundColor] = useState('#f1f1f1')
  const [playBtnColor, setplayBtnColor] = useState('#d72830')
  const [progressBarColor, setProgressBarColor] = useState('#1bb953')
  const [fontColor, setfontColor] = useState('black')
  const [title, setTitle] = useState('Hacker Music')
  const [subtitle, setsubtitle] = useState('An EDM song I found online')
  const [imgUrl, setimgUrl] = useState(constants.exampleImg)
  const [imgFile, setimgFile] = useState('')
  const [audioUrl, setaudio] = useState(constants.exampleAudio)
  const [audioFile, setaudioFile] = useState('')

  const [loading, setloading] = useState(false)
  const [embedUrl, setembedUrl] = useState(constants.exampleEmbedUrl)

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

  const submitHandler = async () => {
    setloading(true)
    // send image and audio files to AWS S3 and get the urls
    const data = await Promise.all([
      sendFileToAWS('image', imgFile),
      sendFileToAWS('audio', audioFile),
    ]).then(([imgUrl, audioUrl]) => {
      console.log({ imgUrl, audioUrl })
      return { imgUrl, audioUrl }
    })
    // send all data including AWS s3 urls to postgresql
    sendDataToDb(data.imgUrl, data.audioUrl)
    setloading(false)
  }

  const sendFileToAWS = async (fileType, file) => {
    const formData = new FormData()
    formData.append(fileType, file)

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    }

    const data = await API.post(`/uploads/${fileType}`, formData, config)
      .then((res) => {
        return res.data.Location
      })
      .catch((err) => {
        console.log(err)
      })

    return data
  }

  const sendDataToDb = async (image, audio) => {
    await API.post('audio-player', {
      title,
      subtitle,
      backgroundColor,
      playBtnColor,
      progressBarColor,
      fontColor,
      imageUrl: image,
      audioUrl: audio,
    })
      .then((res) => {
        setembedUrl(
          `<iframe src="https://audioplayr.netlify.app/embed/${res.data.id}" width="100%" height="200" frameBorder="0" scrolling="no"></iframe>`
        )
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <>
      <Navbar>
        <NavbarInput
          elemColor='backgroundColor'
          title='Background color: '
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
        <NavbarInput
          elemColor='playBtnColor'
          title='Play button color: '
          value={playBtnColor}
          onChange={(e) => setplayBtnColor(e.target.value)}
        />
        <NavbarInput
          elemColor='progressBarColor'
          title='Progress bar color: '
          value={progressBarColor}
          onChange={(e) => setProgressBarColor(e.target.value)}
        />
        <NavbarInput
          elemColor='fontColor'
          title='Font color: '
          value={fontColor}
          onChange={(e) => setfontColor(e.target.value)}
        />

        <div className='upload-file-button'>
          <label for='image'>Upload image</label>
          <input
            type='file'
            id='image'
            accept='image/png, image/jpeg'
            onChange={(e) => {
              setimgFile(e.target.files[0])
              setimgUrl(URL.createObjectURL(e.target.files[0]))
            }}
          ></input>
        </div>

        <div className='upload-file-button'>
          <label for='audio'>Upload audio</label>
          <input
            type='file'
            id='audio'
            accept='audio/*'
            onChange={(e) => {
              setaudioFile(e.target.files[0])
              setaudio(URL.createObjectURL(e.target.files[0]))
            }}
          ></input>
        </div>

        <button
          disabled={loading}
          className='submit-button'
          onClick={submitHandler}
          style={{ backgroundColor: loading ? 'grey' : '#8a4af3' }}
        >
          {loading ? <div class='loader'></div> : null}
          Submit
        </button>
      </Navbar>
      <div
        style={{
          backgroundColor: `${backgroundColor}`,
        }}
        className='embed-audio-container'
      >
        <img draggable='false' className='podcast-image' src={imgUrl} />
        <div className='podcast-info'>
          <div className='controls-container'>
            <button className='play-button' onClick={play}>
              {!isPlaying ? (
                <FaPlayCircle color={playBtnColor} size={70} />
              ) : (
                <FaPauseCircle color={playBtnColor} size={70} />
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
                  color: `${fontColor}`,
                }}
                maxLength='40'
                value={title}
                rows='1'
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  width: '100%',
                  fontSize: '16px',
                  fontWeight: 400,
                  resize: 'none',
                  color: `${fontColor}`,
                }}
                maxLength='85'
                value={subtitle}
                onChange={(e) => setsubtitle(e.target.value)}
              />
            </div>
          </div>
          <div style={{ marginTop: '.5rem' }}>
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
            src={audioUrl}
          />
        </div>
      </div>

      <textarea className='embed-url-textarea' rows={3} value={embedUrl} />
    </>
  )
}

export default CustomizePlayer
