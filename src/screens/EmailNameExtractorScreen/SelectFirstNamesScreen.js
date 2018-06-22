import React, { Component, Fragment } from 'react'

import {
  capitalizeFirstLetter,
  extractEmailParts,
} from '../../utils/StringUtils'

import Creatable from '../../components/Creatable'
import Page from '../../components/Page'
import Card from '../../components/Card'

class SelectFirstNamesScreen extends Component {
  state = {

  }

  onClickAddName = name => {
    const {
      firstNameValues,
      onChangeFirstNameValues,
    } = this.props
    const newValue = { value: name, label: name }
    if (firstNameValues) {
      firstNameValues.push(newValue)
      onChangeFirstNameValues(firstNameValues)
    } else {
      onChangeFirstNameValues([newValue])
    }
    // console.log('onClickAddName', name)
  }

  render() {
    const {
      lines,
      emailsWithoutMatch,
      // fieldEmail,
      // fieldFirstName,
      // fieldLastName,
      firstNameValues,
      firstNameOptions,
      onChangeFirstNameValues,
      // options,
    } = this.props
    if (!lines) {
      return null
    }
    const totalCount = lines.length
    const missingCount = emailsWithoutMatch && emailsWithoutMatch.length
    const matchCount = totalCount - missingCount
    const ratio = matchCount * 1.0 / totalCount * 1.0
    const percent = ratio * 100
    const percentClean = Math.round(percent * 10) / 10;
    return (
      <div>
        {firstNameOptions && (
          <Fragment>
            <Creatable
              value={firstNameValues}
              options={firstNameOptions}
              onChange={onChangeFirstNameValues}
              title={`Select all the first names you can find`}
              placeholder={`Select all the first names you can find`}
            />
            {emailsWithoutMatch && (
              <Fragment>
                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                <h2>{`${percentClean}% match`}</h2>
                <small>{`You matched ${matchCount} emails on a total of ${totalCount}`}</small>
                <br /><br /><br /><br />
                <h2>{`You still need to match ${missingCount} email`}</h2>
                <Card>
                  {emailsWithoutMatch.map(email => {
                    return (
                      <div className="Line">
                        <small key={email}>{email}</small>
                        {extractEmailParts(email).map((part, i) => <button onClick={() => this.onClickAddName(capitalizeFirstLetter(part))}><p>{part}</p></button>)}
                      </div>
                    )
                  }
                  )}
                </Card>
              </Fragment>
            )}
          </Fragment>
        )}
      </div>
    )
  }
}

export default SelectFirstNamesScreen