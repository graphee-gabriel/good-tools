import React from 'react'
import Select from 'react-select'
import './index.css'

const ZSelect = ({ className, ...props }) =>
  <Select
    className={"ZSelect " + className}
    multi
    clearable
    closeOnSelect
    {...props}
  />

export default ZSelect