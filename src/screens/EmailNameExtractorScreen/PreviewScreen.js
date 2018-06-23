import React, { Component, Fragment } from 'react'

import Select from '../../components/Select'
import CSVLineEditor from '../../components/EmailNameExtractor/CSVLineEditor'
const FILTER_OPTIONS = [
  { value: 'missing', label: 'Only missing matches' },
  { value: 'match', label: 'Only matches' }
]
class PreviewScreen extends Component {

  state = {

  }

  onChangeFiterValue = filterValue => {
    this.setState({ filterValue })
  }

  onChangeLineValue = ({
    field,
    line,
    lineIndex,
    value
  }) => {
    line[field] = value ? value.value : null
    this.props.onUpdateLine({ line, lineIndex })
    // console.log('value', value)
    // console.log('value.value', value.value)
    // console.log('line', line)
    // console.log('field', field)
    // console.log('value', value)
  }

  render() {
    const {
      lines,
      fieldEmail,
      fieldFirstName,
      fieldLastName,
      firstNameValues,
      // firstNameOptions,
      // onChangeFirstNameValues,
      // options,
    } = this.props
    const { filterValue } = this.state
    let linesWithIndex = filterValue ? [] : lines.map((line, i) => ({ line, lineIndex: i }))
    if (filterValue) {
      const showOnlyMatch = filterValue.value === 'match'
      linesWithIndex = lines.filter(line => {
        const firstName = line[fieldFirstName.value]
        // const lastName = line[lastName.value]
        return (firstName != null && firstName !== undefined && firstName !== '') === showOnlyMatch
      }).map((line, i) => ({ line, lineIndex: i }))
    }
    return (
      <div>
        <Select
          value={filterValue}
          onChange={this.onChangeFiterValue}
          options={FILTER_OPTIONS}
          multi={false}
        />

        {lines && (
          <Fragment>
            {fieldEmail && fieldFirstName && fieldLastName && (
              <div>
                <div>
                  {linesWithIndex.map(({ line, lineIndex }) => {
                    const editorFields = [
                      fieldEmail,
                      fieldFirstName,
                      fieldLastName
                    ].map(({ value: field }, i) => {
                      const value = line[field]
                      const options = i === 1 ? firstNameValues : null
                      return ({
                        editable: i !== 0,
                        placeholder: field,
                        options,
                        value: value && { label: value, value: value },
                        onChange: newValue => this.onChangeLineValue({
                          field,
                          line,
                          lineIndex,
                          value: newValue
                        })
                      })
                    })

                    return (
                      <CSVLineEditor key={lineIndex} fields={editorFields} />
                    )
                  })}
                </div>
              </div>
            )}
          </Fragment>
        )}
      </div>
    )
  }
}

export default PreviewScreen