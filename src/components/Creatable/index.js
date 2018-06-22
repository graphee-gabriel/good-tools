import React from 'react'
import { Creatable } from 'react-select'
import './index.css'

const ZCreatable = ({ className, ...props }) =>
  <Creatable
    className={"ZCreatable " + className}
    closeOnSelect={false}
    multi
    clearable={false}
    {...props}
  />

export default ZCreatable