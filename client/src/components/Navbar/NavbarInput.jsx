import React from 'react'
import './NavbarInput.css'

const NavbarInput = (props) => {
  return (
    <div className='navbar-inputs'>
      <label for={props.elemColor}>{props.title} </label>
      <input
        type='color'
        id={props.elemColor}
        value={props.value}
        onChange={props.onChange}
      ></input>
    </div>
  )
}

export default NavbarInput
