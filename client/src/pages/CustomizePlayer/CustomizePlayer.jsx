import React, { useState } from 'react'
import API from '../../api/api'
import Navbar from '../../components/Navbar/Navbar'
import ColorPicker from '../../components/ColorPicker/ColorPicker'
import constants from '../../constants/constants'
import FileUpload from '../../components/FileUpload/FileUpload'
import Player from '../../components/Player/Player'
import toast, { Toaster } from 'react-hot-toast'
import './CustomizePlayer.css'

function CustomizePlayer() {
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

  const submitHandler = async () => {
    if (!imgFile || !audioFile) {
      toast.error('Please upload both image and audio files.')
    } else {
      setloading(true)
      // send image and audio files to AWS S3 and get the urls
      const data = await Promise.all([
        sendFileToAWS('image', imgFile),
        sendFileToAWS('audio', audioFile),
      ]).then(([imgUrl, audioUrl]) => {
        return { imgUrl, audioUrl }
      })
      // send all data including AWS s3 urls to postgresql
      sendDataToDb(data.imgUrl, data.audioUrl)
      setloading(false)
      toast.success('Media Successfully Uploaded!')
    }
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
          `<iframe src="${window.location.href}embed/${res.data.id}" width="60%" height="220" frameBorder="0" scrolling="no"></iframe>`
        )
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <>
      <Navbar>
        <ColorPicker
          elemColor='backgroundColor'
          title='Background color: '
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
        <ColorPicker
          elemColor='playBtnColor'
          title='Play button color: '
          value={playBtnColor}
          onChange={(e) => setplayBtnColor(e.target.value)}
        />
        <ColorPicker
          elemColor='progressBarColor'
          title='Progress bar color: '
          value={progressBarColor}
          onChange={(e) => setProgressBarColor(e.target.value)}
        />
        <ColorPicker
          elemColor='fontColor'
          title='Font color: '
          value={fontColor}
          onChange={(e) => setfontColor(e.target.value)}
        />

        <FileUpload
          fileType='image'
          title='Upload image'
          accept={'image/png, image/jpeg'}
          onChange={(e) => {
            setimgFile(e.target.files[0])
            setimgUrl(URL.createObjectURL(e.target.files[0]))
          }}
        />

        <FileUpload
          fileType='audio'
          title='Upload audio'
          accept={'audio/*'}
          onChange={(e) => {
            setaudioFile(e.target.files[0])
            setaudio(URL.createObjectURL(e.target.files[0]))
          }}
        />

        <button
          disabled={loading}
          className='submit-button'
          onClick={submitHandler}
          style={{ backgroundColor: loading ? 'grey' : '#8a4af3' }}
        >
          {loading ? <div class='loader'></div> : null}
          Save
        </button>
      </Navbar>

      <div className='customize-player-container'>
        <Player
          backgroundColor={backgroundColor}
          imgUrl={imgUrl}
          playBtnColor={playBtnColor}
          fontColor={fontColor}
          title={title}
          subtitle={subtitle}
          progressBarColor={progressBarColor}
          audioUrl={audioUrl}
        >
          <textarea
            style={{
              color: `${fontColor}`,
            }}
            className='title'
            maxLength='40'
            value={title}
            rows='1'
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            style={{
              color: `${fontColor}`,
            }}
            className='subtitle'
            maxLength='85'
            value={subtitle}
            onChange={(e) => setsubtitle(e.target.value)}
          />
        </Player>

        <textarea className='embed-url-textarea' rows={3} value={embedUrl} />
      </div>
      <Toaster />
    </>
  )
}

export default CustomizePlayer
