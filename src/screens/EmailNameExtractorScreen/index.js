import React, { Component } from 'react'
import parse from 'csv-parse'
import { Switch, Route, Redirect, withRouter } from 'react-router'

import {
  capitalizeFirstLetter,
  extractEmailParts,
  buildNamesFromEmails,
  // removeComma, 
  clean
} from '../../utils/StringUtils'
import {
  readTextFile
} from '../../utils/FileUtils'

import UploadCSVScreen from './UploadCSVScreen'
import SelectFirstNamesScreen from './SelectFirstNamesScreen'
import PreviewScreen from './PreviewScreen'
import ExportScreen from './ExportScreen'

import Page from '../../components/Page'
import Dropzone from '../../components/Dropzone'
import Select from '../../components/Select'
import Creatable from '../../components/Creatable'
import Stepper from '../../components/Stepper'
import CSVLineEditor from '../../components/EmailNameExtractor/CSVLineEditor'

const SAVE_STATE_INTERVAL = 5000

const EMAIL_FIELD_NAMES = [
  'email',
  'e-mail',
  'e_mail',
  'e.mail',
  'mail',
]

const FIRST_NAME_FIELD_NAMES = [
  'first name',
  'first_name',
  'first.name',
  'first',
]

const LAST_NAME_FIELD_NAMES = [
  'last name',
  'last_name',
  'last.name',
  'last',
]

const SCREENS = [
  {
    title: 'Upload CSV',
    path: 'file',
    enabled: props => true,
    component: <UploadCSVScreen />,
  },
  {
    title: 'Select first names',
    path: 'names',
    enabled: ({
      fieldEmail,
      fieldFirstName,
      fieldLastName,
      firstNameOptions,
    }) => fieldEmail != null && fieldFirstName != null && fieldLastName != null && firstNameOptions != null,
    component: <SelectFirstNamesScreen />
  },
  {
    title: 'Preview',
    path: 'preview',
    enabled: props => true,
    component: <PreviewScreen />
  },
  {
    title: 'Export',
    path: 'export',
    enabled: props => true,
    component: <ExportScreen />
  },
]


class EmailNameExtractorScreen extends Component {
  state = {
    options: [],
    fields: [],
    lines: [],
    showOnlyCsv: false,
    fieldEmail: null,
    fieldFirstName: null,
    fieldLastName: null,
    emailsWithoutMatch: [],
    firstNameValues: [],
  }

  constructor(props) {
    super(props)
    const stateAsString = localStorage.getItem(`emailNameExtractorState`)
    if (stateAsString)
      this.state = JSON.parse(stateAsString)
    // const { lines, fieldEmail, fieldFirstName } = this.state
    // lines.find(line => line[fieldEmail.value] === 'viata.pe.un.peron@gmail.com')[fieldFirstName.value] = ''
    this.intervalIdSaveState = setInterval(this.saveStateAsLocalDraft, SAVE_STATE_INTERVAL)
  }

  componentWillUnmount() {
    clearInterval(this.intervalIdSaveState)
  }

  saveStateAsLocalDraft = () => {
    const stateAsString = JSON.stringify(this.state)
    localStorage.setItem(`emailNameExtractorState`, stateAsString)
  }

  setStateWithCallbacks = (state, callbacks) => {
    if (callbacks && callbacks.length > 0) {
      this.setState(state, () => {
        callbacks.forEach(callback => callback())
      })
    } else {
      this.setState(state)
    }
  }

  setStateAndBuildCSV = (state, callback) => {
    if (callback)
      this.setStateWithCallbacks(state, [
        callback,
        this.buildCSV
      ])
    else
      this.setState(state, this.buildCSV)
  }

  onChangeFieldEmail = fieldEmail => {
    let emailsWithoutMatch
    if (fieldEmail) {
      emailsWithoutMatch = this.state.lines.map(line => line[fieldEmail.value])
    }
    this.setStateAndBuildCSV({ fieldEmail, emailsWithoutMatch }, this.buildFirstNameOptions)
  }

  onChangeFieldFirstName = fieldFirstName => {
    this.setStateAndBuildCSV({ fieldFirstName })
  }

  onChangeFieldLastName = fieldLastName => {
    this.setStateAndBuildCSV({ fieldLastName })
  }

  onChangeFirstNameValues = firstNameValues => {
    this.setStateAndBuildCSV({ firstNameValues }, this.buildMatches)
  }

  onUpdateLine = ({ line, lineIndex }) => {
    const { lines } = this.state
    lines[lineIndex] = line
    this.setStateAndBuildCSV({ lines })
  }

  onClickCSV = () => {
    this.setState(prevState => ({ showOnlyCsv: !prevState.showOnlyCsv }))
  }

  onClickStep = path => {
    if (path === 'export') {
      this.buildCSV(() => {
        this.props.history.push(path)
      })
    } else {
      this.props.history.push(path)
    }
  }

  onDrop = (files) => {
    if (files && files.length > 0) {
      const file = files[0]
      readTextFile(file, originalCsv => {
        this.originalCsv = originalCsv
        const allLines = originalCsv.split('\n')
        const csvHeader = allLines[0]
        const csvLines = allLines.filter((line, i) => i !== 0)
        const options = csvHeader.split(',').map(x => ({ label: x, value: x }))
        const linesArray = csvLines.map(line => line.split(','))
        const lines = []
        linesArray.forEach(array => {
          let line = {}
          array.forEach((x, i) => {
            if (i < options.length)
              line[options[i].label] = x && x.replace(/'/g , '').replace(/"/g , '')
          })
          lines.push(line)
        })
        let fieldEmail, fieldFirstName, fieldLastName
        options.forEach(({ value }) => {
          const valueClean = value.toLowerCase().replace(/'/g , '').replace(/"/g , '')
          EMAIL_FIELD_NAMES.forEach(variant => {
            if (!fieldEmail && valueClean.indexOf(variant) !== -1)
              fieldEmail = { value, label: value }
          })
          FIRST_NAME_FIELD_NAMES.forEach(variant => {
            if (!fieldFirstName && valueClean.indexOf(variant) !== -1)
              fieldFirstName = { value, label: value }
          })
          LAST_NAME_FIELD_NAMES.forEach(variant => {
            if (!fieldLastName && valueClean.indexOf(variant) !== -1)
              fieldLastName = { value, label: value }
          })
        })

        let emailsWithoutMatch
        if (fieldEmail) {
          emailsWithoutMatch = lines.map(line => line[fieldEmail.value])
        }
        // console.log('lines', lines)
        // console.log('options', options)
        this.setState({
          options,
          emailsWithoutMatch,
          lines,
          fieldEmail,
          fieldFirstName,
          fieldLastName
        }, () => {
          if (fieldEmail) this.buildFirstNameOptions()
        });
      })
    }
  }

  checkForGoToStepFirstName = () => {
    const path = 'names'
    const screenSelectFirstNames = SCREENS.find(x => x.path === path)
    if (screenSelectFirstNames.enabled(this.state)) {
      this.props.history.push(path)
    }
  }

  buildFirstNameOptions = () => {
    const {
      fieldEmail,
      lines,
      emailsWithoutMatch,
      // firstNameOptions 
    } = this.state
    if (fieldEmail && lines) {

      const emails = lines.map(line => line[fieldEmail.value])
      const allNames = buildNamesFromEmails(emails)
      // const namesWithoutMatch = buildNamesFromEmails(emailsWithoutMatch)

      let firstNameOptionsArray = buildNamesFromEmails(emailsWithoutMatch)
      allNames.forEach(name => {
        if (firstNameOptionsArray.indexOf(name) === -1)
          firstNameOptionsArray.push(name)
      })
      const firstNameOptions = firstNameOptionsArray.map(x => ({ value: x, label: x }))
      this.setStateWithCallbacks({
        firstNameOptions,
        // firstNameValues: firstNameOptions
      }, this.checkForGoToStepFirstName)
      // console.log('firstNameOptions', firstNameOptions)
    }
  }

  buildMatches = () => {
    const {
      lines,
      fieldEmail,
      fieldFirstName,
      fieldLastName,
      firstNameValues
    } = this.state
    const emailsWithoutMatch = []
    const firstNames = firstNameValues.map(x => x.value.toLowerCase())
    lines.forEach((line, i) => {
      let firstName
      const email = line[fieldEmail.value]
      const emailParts = extractEmailParts(email).map(x => x.toLowerCase())

      emailParts.forEach(part => {
        // console.log('part', part)
        if (!firstName && firstNames.indexOf(part) !== -1) {
          firstName = capitalizeFirstLetter(part)
        }
        if (!firstName) {
          firstNames.forEach(first => {
            if (first.length > 3 && (!firstName || first.length > firstName.length) && part.indexOf(first) !== -1)
              firstName = capitalizeFirstLetter(first)
          })
        }
      })

      if (firstName) {
        lines[i][fieldFirstName.value] = firstName
      } else {
        emailsWithoutMatch.push(email)
      }

      if (firstName) {
        let lastName
        if (emailParts.length == 1) {
          const part = emailParts[0]
          lastName = part.replace(firstName.toLowerCase(), '')
        } else if (emailParts.length == 2) {
          emailParts.forEach(part => {
            if (part !== firstName.toLowerCase())
              lastName = part
          })
        }
        if (lastName && lastName.length > 1)
          lines[i][fieldLastName.value] = capitalizeFirstLetter(lastName)
      }
    })
    this.setState({ lines, emailsWithoutMatch }, this.buildFirstNameOptions)
    // console.log('firstNames',firstNames)
  }

  buildCSV = (callback) => {
    const { lines, options } = this.state
    let csv = ''
    const headers = options.map(o => o.value)
    const csvHeader = headers.join(',') + '\r\n'
    csv += csvHeader
    lines.forEach(line => {
      headers.forEach((header, i) => {
        let value = line[header]
        if (!value || value == null || value == undefined || value === 'null' || value === 'undefined')
          value = ''
        csv += value
        if (i < headers.length - 1)
          csv += ','
      })
      csv += '\r\n'
    })
    console.log('csv', csv)
    this.setState({ csv }, callback);
  }

  // getCSVLine = (author, song) => {
  //   if (author && song)
  //     return `${clean(author.trim())} - ${clean(song.trim())}\r\n`
  //   return ''
  // }

  render() {
    const {
      csv,
      fieldEmail,
      fieldFirstName,
      fieldLastName,
      firstNameValues,
      firstNameOptions,
      options,
      lines,
      showOnlyCsv
    } = this.state

    const { match } = this.props
    let { url } = match
    if (url.endsWith('/')) url = url.slice(0, -1)

    if (showOnlyCsv)
      return (
        <Page>
          <code className="clickable scroll-x" onClick={this.onClickCSV}>
            {csv}
          </code>
        </Page>
      )

    return (
      <Page>
        <Stepper
          steps={SCREENS}
          onClickStep={this.onClickStep}
          {...this.state}
        />
        <Switch>
          {SCREENS.map(({ path, component, enabled }, i) => {
            const validated = i < SCREENS.length - 1 ? SCREENS[i + 1].enabled : false
            return (
              <Route
                key={path}
                exact path={`${match.path}/${path}`}
                render={props => React.cloneElement(component, {
                  onDrop: this.onDrop,
                  onChangeFieldEmail: this.onChangeFieldEmail,
                  onChangeFieldFirstName: this.onChangeFieldFirstName,
                  onChangeFieldLastName: this.onChangeFieldLastName,
                  onChangeFirstNameValues: this.onChangeFirstNameValues,
                  onUpdateLine: this.onUpdateLine,
                  onClickCSV: this.onClickCSV,
                  validated,
                  ...this.state,
                  ...this.props,
                  ...props,
                })}
              />
            )
          }
          )}
          <Route
            path={`${match.path}/`}
            render={() => <Redirect to={`${url}/${SCREENS[0].path}`} />}
          />
        </Switch>
      </Page>
    )
  }
}

export default withRouter(EmailNameExtractorScreen)
