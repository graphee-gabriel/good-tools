import React from 'react'
import { Link } from 'react-router-dom'

import './index.css'

const LinkButton = ({
  className,
  enabled,
  to,
  children,
  ...props
}) =>
  <button disabled={!enabled} className={"LinkButton " + className} {...props}>
    {enabled ?
      <Link to={to}>{children}</Link>
      : <p>{children}</p>
    }
  </button>

export default LinkButton