import React from 'react'
import './index.css'

const Card = ({ className, ...props }) =>
  <div className={"Card " + className} {...props} />

export default Card