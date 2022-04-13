import React, { useState, useEffect, useRef } from 'react'
import API from '../../api/api'
import { BsArrowClockwise, BsArrowCounterclockwise } from 'react-icons/bs'
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa'
import Slider from '../../components/Slider/Slider'
import ControlPanel from '../../components/Controls/ControlPanel'
import Navbar from '../../components/Navbar/Navbar'
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

  const [title, setTitle] = useState('The Story of Aaron Schwartz')
  const [subtitle, setsubtitle] = useState(
    'Hacktivism and the limits of Open Source'
  )
  const [imgUrl, setimgUrl] = useState('https://i.ibb.co/98ck5mT/aaron.jpg')
  const [imgFile, setimgFile] = useState('')
  const [audioUrl, setaudio] = useState(
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  )
  const [audioFile, setaudioFile] = useState('')

  const [buttonTitle, setbuttonTitle] = useState('Copy Embed Link')

  const [embedUrl, setembedUrl] = useState(
    'http://localhost:3000/embed/ca43a8e1-f94c-4b0a-98cb-474ef0879502'
  )
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

  const submitHandler = async () => {
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
  }

  const sendFileToAWS = async (fileType, file) => {
    const formData = new FormData()
    formData.append(fileType, file)

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    }

    const data = await API.post(`/uploads/${fileType}`, formData, config).then(
      (res) => {
        return res.data.Location
      }
    )

    return data
  }

  const sendDataToDb = async (image, audio) => {
    await API.post('audio-player', {
      title,
      subtitle,
      backgroundColor,
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
                // console.log(e.target.files[0])
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
              name='audio'
              accept='audio/*'
              onChange={(e) => {
                console.log(e.target.files[0])
                setaudioFile(e.target.files[0])
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
                // border: '1px solid red',
                width: '100%',
                marginTop: '.25rem',
                // marginLeft: '1rem',
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

      <div
        style={{
          marginLeft: '330px',
          marginTop: '2rem',
          width: '60%',
        }}
      >
        <div>
          <textarea
            style={{
              width: '67.5%',
              boxSizing: 'border-box',
              resize: false,
              float: 'left',
              border: '1px solid lightgrey',
              borderRadius: '5px',
              backgroundColor: '#f1f1f1',
              padding: '10px',
            }}
            rows={3}
            value={embedUrl}
          />
        </div>
        <div className='audio-player-submit-button'>
          <button
            style={{ width: '30%', float: 'right' }}
            className='copy-button'
            onClick={() => {
              navigator.clipboard.writeText(embedUrl)
              setbuttonTitle('Copied!')
              setTimeout(() => {
                setbuttonTitle('Copy Embed Link')
              }, 2500)
            }}
          >
            {buttonTitle}
          </button>
        </div>
      </div>
    </>
  )
}

export default CustomizePlayer
