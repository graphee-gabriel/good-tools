import React, { Component } from 'react'

import Dropzone from '../../components/Dropzone'
import Select from '../../components/Select'
import LinkButton from '../../components/LinkButton'

class UploadCSVScreen extends Component {
  state = {

  }

  render() {
    const {
      lines,
      fieldEmail,
      fieldFirstName,
      fieldLastName,
      options,
      onDrop,
      onChangeFieldEmail,
      onChangeFieldFirstName,
      onChangeFieldLastName,
      validated,
    } = this.props
    const isValidated = validated(this.props)
    console.log('isValidated', isValidated)
    return (
      <div>
        <Dropzone
          onDrop={onDrop}
          title={`Drop your e-mail list here`}
          description={`Your list should be a *.csv file`}
        />
        {lines && (
          <div>
            <Select
              value={fieldEmail}
              options={options}
              onChange={onChangeFieldEmail}
              title={`Select the email field`}
              placeholder={`Select the email field`}
              multi={false}
            />
            <Select
              value={fieldFirstName}
              options={options}
              onChange={onChangeFieldFirstName}
              title={`Select the first name field`}
              placeholder={`Select the first name field`}
              multi={false}
            />
            <Select
              value={fieldLastName}
              options={options}
              onChange={onChangeFieldLastName}
              title={`Select the last name field`}
              placeholder={`Select the last name field`}
              multi={false}
            />
          </div>
        )}

        <LinkButton enabled={isValidated} to="names">
          Validate
        </LinkButton>
      </div>
    )
  }
}

export default UploadCSVScreen