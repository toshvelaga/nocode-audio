import React from 'react'
import './Navbar.css'

const Navbar = (props) => {
  return <div className='navbar'>{props.children}</div>
}

export default Navbar
