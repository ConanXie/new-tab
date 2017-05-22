import './style.less'

import classNames from 'classnames'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as settingsActions from '../../../actions/settings'

import muiThemeable from 'material-ui/styles/muiThemeable'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import { List, ListItem } from 'material-ui/List'
import Dialog from 'material-ui/Dialog'
import ImageLens from 'material-ui/svg-icons/image/lens'
import ActionDone from 'material-ui/svg-icons/action/done'
import ImageColorize from 'material-ui/svg-icons/image/colorize'
import ColorLens from 'material-ui/svg-icons/image/color-lens'
import {
  grey600,
  teal500,
  red500,
  pink500,
  indigo500,
  blue500,
  deepOrange500,
  purple500,
  green500,
  orange500,
  blueGrey500,
  amber500,
  brown500,
  grey500,
  lightBlue500,
  deepPurple500
} from 'material-ui/styles/colors'

export const themes = [{
  name: chrome.i18n.getMessage('themeTeal'),
  color: teal500
}, {
  name: chrome.i18n.getMessage('themeRed'),
  color: red500
}, {
  name: chrome.i18n.getMessage('themePink'),
  color: pink500
}, {
  name: chrome.i18n.getMessage('themeIndigo'),
  color: indigo500
}, {
  name: chrome.i18n.getMessage('themeBlue'),
  color: blue500
}, {
  name: chrome.i18n.getMessage('themeDeepOrange'),
  color: deepOrange500
}, {
  name: chrome.i18n.getMessage('themePurple'),
  color: purple500
}, {
  name: chrome.i18n.getMessage('themeGreen'),
  color: green500
}, {
  name: chrome.i18n.getMessage('themeOrange'),
  color: orange500
}, {
  name: chrome.i18n.getMessage('themeBlueGrey'),
  color: blueGrey500
}, {
  name: chrome.i18n.getMessage('themeAmber'),
  color: amber500
}, {
  name: chrome.i18n.getMessage('themeBrown'),
  color: brown500
}, {
  name: chrome.i18n.getMessage('themeGrey'),
  color: grey500
}, {
  name: chrome.i18n.getMessage('themeLightBlue'),
  color: lightBlue500
}, {
  name: chrome.i18n.getMessage('themeDeepPurple'),
  color: deepPurple500
}]

export const DARK_THEME = 'dark'
export const BRIGHT_THEME = 'bright'

const style = {
  dialogContent: {
    width: '380px'
  },
  dialogBody: {
    padding: '16px 0'
  },
  radio: {
    marginBottom: '16px'
  }
}

class Theme extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    const { currentTheme, customTheme } = props.settings
    this.state = {
      themeOpen: false,
      customizationOpen: false,
      color: customTheme ? customTheme.color : '',
      hue: customTheme ? customTheme.hue : DARK_THEME
    }
    this.checkColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  }
  openTheme = () => {
    this.setState({
      themeOpen: true
    })
  }
  hideTheme = () => {
    this.setState({
      themeOpen: false
    })
  }
  switchTheme = index => {
    const { saveSettings, changeTheme, settings } = this.props
    saveSettings({
      currentTheme: index,
      darkMode: false
    })
    setTimeout(() => {
      this.hideTheme()
    }, 200)
  }
  openCustomization = () => {
    this.setState({
      customizationOpen: true
    })
  }
  hideCustomization = () => {
    const { customTheme } = this.props.settings
    if (customTheme) {
      const { color, hue } = customTheme
      this.setState({
        customizationOpen: false,
        color,
        hue
      })
    } else {
      this.setState({
        customizationOpen: false,
        color: '',
        hue: DARK_THEME
      })
    }
  }
  handleColorInput = (e, newValue) => {
    const color = newValue.toUpperCase()

    this.setState({
      color
    })

    if (this.checkColor.test(color)) {
      this.refs.color.value = color
    }
  }
  getColor = e => {
    const value = e.target.value.toUpperCase()
    this.setState({ color: value })
  }
  handleHue = (e, value) => {
    this.setState({
      hue: value
    })
  }
  setCustomizedColor = () => {
    const { color, hue } = this.state
    const { saveSettings, toggleDarkMode, settings } = this.props
    this.hideCustomization()
    if (this.checkColor.test(color)) {
      saveSettings({
        currentTheme: -1,
        darkMode: false,
        customTheme: { color, hue }
      })
      this.hideTheme()
      this.setState({
        color,
        hue
      })
    }
  }
  render() {
    const { intl } = this.context
    const { muiTheme, settings } = this.props
    const current = settings.currentTheme ? settings.currentTheme : 0
    const { customizationOpen, color, hue } = this.state

    const customizeActions = [
      <FlatButton
        label={intl.formatMessage({ id: 'button.cancel' })}
        primary={true}
        onTouchTap={this.hideCustomization}
      />,
      <FlatButton
        label={intl.formatMessage({ id: 'button.confirm' })}
        primary={true}
        onTouchTap={this.setCustomizedColor}
      />
    ]

    return (
      <div>
        <ListItem
          leftIcon={<ColorLens style={{ marginLeft: 0 }} color={muiTheme.palette.primary1Color} />}
          primaryText={intl.formatMessage({ id: 'settings.theme.switch.label' })}
          innerDivStyle={{ paddingLeft: '58px' }}
          onTouchTap={this.openTheme}
        />
        <Dialog
          open={this.state.themeOpen}
          onRequestClose={this.hideTheme}
          bodyStyle={style.dialogBody}
          contentStyle={style.dialogContent}
          autoDetectWindowHeight={false}
          contentClassName="palette-content"
        >
          {themes.map((item, index) => {
            const { name, color } = item
            return (
              <ListItem
                key={index}
                primaryText={name}
                leftIcon={<ImageLens color={color} />}
                rightIcon={<ActionDone color={color} style={{ display: current !== index ? 'none' : '' }} />}
                style={{ color }}
                onTouchTap={e => { this.switchTheme(index) }}
              />
            )
          })}
          <ListItem
            primaryText={intl.formatMessage({ id: 'theme.custom.label' })}
            leftIcon={<ImageColorize color={color} />}
            rightIcon={<ActionDone  color={color} style={{ display: current !== -1 ? 'none' : '' }} />}
            style={{ color }}
            onTouchTap={this.openCustomization}
          />
        </Dialog>
        <Dialog
          open={customizationOpen}
          actions={customizeActions}
          onRequestClose={this.hideCustomization}
          contentStyle={style.dialogContent}
        >
          <div className="color-circle">
            <input type="color" id="color" hidden onInput={this.getColor} value={color} ref="color" onChange={() => {}} />
            <label htmlFor="color" style={{ backgroundColor: color }}></label>
            <TextField
              floatingLabelText={intl.formatMessage({ id: 'theme.input.placeholder' })}
              value={color}
              onChange={this.handleColorInput}
            />
          </div>
          <RadioButtonGroup name="hue" defaultSelected={hue} onChange={this.handleHue}>
            <RadioButton
              value={DARK_THEME}
              label={intl.formatMessage({ id: 'theme.radio.dark' })}
              style={style.radio}
            />
            <RadioButton
              value={BRIGHT_THEME}
              label={intl.formatMessage({ id: 'theme.radio.bright' })}
              style={style.radio}
            />
          </RadioButtonGroup>
          <FlatButton
            label="Material Palette Link"
            href="https://material.io/color/#!/?view.left=0&view.right=0"
            target="_blank"
          />
        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { settings } = state
  return { settings }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(settingsActions, dispatch)
}

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(Theme))
