import './style.less'

import classNames from 'classnames'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import muiThemeable from 'material-ui/styles/muiThemeable'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import IconButton from 'material-ui/IconButton'
import NavigationApps from 'material-ui/svg-icons/navigation/apps'

const style = {
  appBtn: {
    height: 'auto',
    width: '110px',
    minWidth: 'none',
    lineHeight: 'normal',
    borderRadius: '100%',
    overFlow: 'hidden'
  },
  tooltip: {
    fontSize: '14px'
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
  componentWillReceiveProps(nextProps) {
    // Lazy load
    if (nextProps.load) {
      /**
       * Get all installed Chrome Apps
       */
      chrome.management.getAll(exInfoArray => {
        const apps = exInfoArray.filter(ex => ex.isApp)
        this.setState({ apps })
      })
    }
  }
  render() {
    const { apps } = this.state
    const { settings, muiTheme } = this.props
    const { intl } = this.context
    return (
      <div className="apps-component">
        <div className="tool">
          <IconButton
            tooltip={intl.formatMessage({ id: 'apps.manage.tip' })}
            tooltipPosition="bottom-right"
            tooltipStyles={style.tooltip}
            onTouchTap={e => chrome.tabs.update({ url: 'chrome://apps' })}
          >
            <NavigationApps color={muiTheme.palette.primary1Color} />
          </IconButton>
          <h1 style={{ color: muiTheme.palette.primary1Color }}>{intl.formatMessage({ id: 'apps.title' })}</h1>
        </div>
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
                    <dd className={classNames({ 'hide': settings.hideAppsName })}>Chrome Web Store</dd>
                  </dl>
                </a>
              </FlatButton>
            </div>
          )}
          {apps.map(app => {
            const { id, icons, shortName, enabled } = app
            
            const finds = icons.filter(icon => icon.size === 48)
            const { url } = finds.length ? finds[0] : icons[icons.length - 1]

            return (
              <div className="app-box" key={id}>
                <FlatButton style={style.appBtn}>
                  <dl onClick={e => chrome.management.launchApp(id)} title={shortName}>
                    <dt>
                      <img src={`${url}?grayscale=${!enabled}`} alt={shortName} />
                    </dt>
                    <dd className={classNames({ 'hide': settings.hideAppsName })}>{shortName}</dd>
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

const mapStateToProps = state => {
  const { settings } = state
  return { settings }
}

export default muiThemeable()(connect(mapStateToProps)(Apps))
