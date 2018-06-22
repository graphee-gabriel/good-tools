import React from 'react'
import './index.css'

const Page = ({ className, ...props }) =>
  <div className={"Page " + className} {...props} />

export default Page