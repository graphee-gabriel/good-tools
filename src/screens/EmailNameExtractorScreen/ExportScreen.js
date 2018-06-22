import React, { Component, Fragment } from 'react'

import Creatable from '../../components/Creatable'
import Page from '../../components/Page'

class SelectFirstNamesScreen extends Component {
  state = {

  }

  render() {
    const {
      csv,
      onClickCSV,
    } = this.props
    return (
      <div>
        {csv && (
          <div>
            <small>
              To export, click on the text, then CMD+A => CMD+C to get all in the clipboard<br />Then, paste it in a text file and save it as 'myfile.csv'. <br />You can import this *.csv in your system or in a service provider such as MailChimp.
            </small>
            <code
              className="clickable scroll-x"
              onClick={onClickCSV}>
              {csv}
            </code>
          </div>
        )}
      </div>
    )
  }
}

export default SelectFirstNamesScreen