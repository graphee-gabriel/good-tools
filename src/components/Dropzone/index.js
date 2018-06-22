import React from 'react'
import Dropzone from 'react-dropzone'
import Card from '../Card'
import './index.css'

const ZDropzone = ({ className, title, description, children, ...props }) =>
  <Dropzone
    className={"ZDropzone " + className}
    {...props}>
    <Card className="ZDropzone-Card">
      {title && (
        <h2 className="ZDropzone-Title">
          {title}
        </h2>
      )}
      {description && (
        <small className="ZDropzone-Description">
          {description}
        </small>
      )}
      <div>{children}</div>
    </Card>
  </Dropzone>


export default ZDropzone