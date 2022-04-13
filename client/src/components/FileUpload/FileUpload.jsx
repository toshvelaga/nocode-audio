import React from 'react'
import './FileUpload.css'

const FileUpload = (props) => {
  return (
    <div className='upload-file-button'>
      <label htmlFor={props.fileType}>{props.title}</label>
      <input
        type='file'
        id={props.fileType}
        accept={props.accept}
        onChange={props.onChange}
      ></input>
    </div>
  )
}

export default FileUpload
