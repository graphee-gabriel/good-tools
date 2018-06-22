import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import ToolDescription from '../components/ToolDescription'
import Page from '../components/Page'

class HomeScreen extends Component {
  state = {

  }

  render() {
    const { screens } = this.props
    return (
      <Page>
        {screens.map(({ path, ...tool }) =>
          <Link to={path}>
            <ToolDescription {...tool} />
          </Link>
        )}
      </Page>
    )
  }
}

export default HomeScreen