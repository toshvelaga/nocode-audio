import React from 'react'
import './ControlPanel.css'

function ControlPanel({ duration, currentTime, style }) {
  function secondsToHms(seconds) {
    if (!seconds) return '00m 00s'

    let duration = seconds
    const hours = duration / 3600
    duration %= 3600

    let min = parseInt(duration / 60)
    duration %= 60

    let sec = parseInt(duration)

    if (sec < 10) {
      sec = `0${sec}`
    }
    if (min < 10) {
      min = `0${min}`
    }

    if (parseInt(hours, 10) > 0) {
      return `${parseInt(hours, 10)}h ${min}m ${sec}s`
    }
    if (min == 0) {
      return `00m ${sec}s`
    }
    return `${min}m ${sec}s`
  }

  return (
    <>
      <div className='control-panel'>
        <div style={style} className='timer'>
          {secondsToHms(currentTime)}
        </div>
        <div style={style} className='timer'>
          {secondsToHms(duration)}
        </div>
      </div>
    </>
  )
}
export default ControlPanel
