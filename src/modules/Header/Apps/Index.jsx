import './style.less'

import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

const style = {
  appBtn: {
    height: 'auto',
    width: '110px',
    minWidth: 'none',
    lineHeight: 'normal',
    borderRadius: '100%',
    overFlow: 'hidden'
  }
}

class Apps extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      apps: []
    }
  }
  componentDidMount() {
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
    const { intl } = this.context
    return (
      <div className="apps-component">
        <h1 style={{ color: muiTheme.palette.primary1Color }}>Apps</h1>
        <div className={classNames('apps-collection', { 'empty': !apps.length })}>
          {!apps.length && (
            <div>
              <p className="empty-text">{intl.formatMessage({ id: 'empty.text.apps' })}</p>
              <RaisedButton
                label="Web Store"
                primary={true}
                href="https://chrome.google.com/webstore?utm_source=MaterialDesignNewTab"
                target="_blank"
              />
            </div>
          )}
          {!!apps.length && (
            <div className="app-box">
              <FlatButton style={style.appBtn}>
                <a href="https://chrome.google.com/webstore?utm_source=MaterialDesignNewTab">
                  <dl title="Chrome Web Store">
                    <dt>
                      <img src="chrome://extension-icon/ahfgeienlihckogmohjhadlkjgocpleb/128/0" alt="Chrome Web Store" />
                    </dt>
                    <dd className={classNames({ 'hide': hideAppsName })}>Chrome Web Store</dd>
                  </dl>
                </a>
              </FlatButton>
            </div>
          )}
          {apps.map((app, index) => {
            const maxIcon = app.icons.length - 1
            return (
              <div className="app-box" key={index}>
                <FlatButton style={style.appBtn}>
                  <dl onClick={e => { chrome.management.launchApp(app.id) }} title={app.shortName}>
                    <dt>
                      <img src={app.icons[maxIcon].url} alt={app.shortName} />
                    </dt>
                    <dd className={classNames({ 'hide': hideAppsName })}>{app.shortName}</dd>
                  </dl>
                </FlatButton>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default Apps