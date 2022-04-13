import React from 'react'
import './ColorPicker.css'

const ColorPicker = (props) => {
  return (
    <div className='color-picker'>
      <label htmlFor={props.elemColor}>{props.title} </label>
      <input
        type='color'
        id={props.elemColor}
        value={props.value}
        onChange={props.onChange}
      ></input>
    </div>
  )
}

export default ColorPicker
