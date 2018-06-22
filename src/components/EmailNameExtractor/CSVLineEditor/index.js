import React from 'react'
import './index.css'

import Card from '../../Card'
import Creatable from '../../Creatable'

const CSVLineEditor = ({
  fields,
  ...props
}) =>
  <Card className="CSVLineEditor">
    {fields.map(({ editable, ...field }, i) => editable ? (
      <Creatable
        key={i}
        multi={false}
        className="CSVLineEditor-Creatable"
        {...field}
      />
    ) : (
        <h3 key={i}>{field && field.value && field.value.value}</h3>
      )
    )}
  </Card>


export default CSVLineEditor