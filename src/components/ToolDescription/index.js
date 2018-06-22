import React from 'react'
import './index.css'

import Card from '../Card'

const ToolDescription = ({
  title,
  description,
  ...props
}) =>
  <Card className="ToolDescription">
    <h2 className="ToolDescription-Title">
      {title}
    </h2>
    <small className="ToolDescription-Description">
      {description}
    </small>
  </Card>

export default ToolDescription