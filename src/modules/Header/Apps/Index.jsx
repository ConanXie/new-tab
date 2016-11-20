import './style.less'

import classNames from 'classnames'
import React, { Component } from 'react'

class Apps extends Component {
  constructor(props) {
    super(props)
    this.state = {
      apps: []
    }
    /**
     * Get all installed Chrome Apps
     */
    chrome.management.getAll(exInfoArray => {
      const apps = []
      const end = exInfoArray.length - 1
      exInfoArray.forEach((ex, index) => {
        if (ex.isApp) {
          apps.push(ex)
        }
        if (index === end) {
          this.setState({
            apps
          })
        }
      })
    })
  }
  render() {
    const { apps } = this.state
    const { hideAppsName, muiTheme } = this.props
    return (
      <div className="apps-component">
        <h1 style={{ color: muiTheme.palette.primary1Color }}>Apps</h1>
        <div className="apps-collection">
          {apps.map((app, index) => {
            const maxIcon = app.icons.length - 1
            return (
              <div className="app-box" key={index}>
                <dl onClick={e => { chrome.management.launchApp(app.id) }}>
                  <dt>
                    <img src={app.icons[maxIcon].url} alt={app.shortName} />
                  </dt>
                  <dd className={classNames({ 'hide': hideAppsName })}>{app.shortName}</dd>
                </dl>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default Apps