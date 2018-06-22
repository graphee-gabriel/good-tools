import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Switch, Route } from 'react-router'

import './App.css';
import SongsToCSVScreen from './screens/SongsToCSVScreen'
import EmailNameExtractorScreen from './screens/EmailNameExtractorScreen'
import HomeScreen from './screens/HomeScreen'

const SCREENS = [
  {
    title: 'Songs to CSV',
    description: 'Export song info from an audio file to a *.csv',
    path: '/songs_to_csv',
    component: <SongsToCSVScreen />
  },
  {
    title: 'Email name extractor',
    description: 'Extract first name and last name from an e-mail list. Drop a *.csv file, edit it to add first name and last name',
    path: '/email_name_extractor',
    component: <EmailNameExtractorScreen />
  },
]

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          {SCREENS.map(({ path, component }) =>
            <Route
              key={path}
              path={path}
              render={props => component}
            />
          )}
          <Route path={"*"} render={props =>
            <HomeScreen
              screens={SCREENS.map(
                ({ path, title, description }) =>
                  ({ path, title, description })
              )}
            />}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
