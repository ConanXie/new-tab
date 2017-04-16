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
    const { currentTheme, customTheme } = props.data
    this.state = {
      currentTheme: currentTheme ? currentTheme : 0,
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
  switchTheme = (index) => {
    const { currentTheme } = this.state
    const { saveTheme, changeTheme, toggleDarkMode } = this.props
    const { darkMode } = this.props.data
    saveTheme(index)
    changeTheme(index)
    this.setState({
      currentTheme: index
    })
    if (darkMode) {
      toggleDarkMode(null, false)
    }
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
    const customTheme = this.props.data.customTheme
    if (customTheme) {
      const { color, hue } = this.props.data.customTheme
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
      color: color
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
    const { saveSettings, saveTheme, changeTheme, toggleDarkMode } = this.props
    const { darkMode } = this.props.data
    if (this.checkColor.test(color)) {
      // console.log(color, hue)
      const custom = { color, hue }
      this.setState({
        currentTheme: -1
      })
      saveTheme(-1)
      changeTheme(custom)
      if (darkMode) {
        toggleDarkMode(null, false)
      }
      saveSettings('customTheme', custom)
      this.hideTheme()
    }
    this.hideCustomization()
  }
  render() {
    const { intl } = this.context
    const { muiTheme } = this.props
    const { currentTheme, color, hue, customizationOpen } = this.state

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
            {/*if (currentTheme === index) {
              return (
                <IconButton style={style.small} iconStyle={style.smallIcon} key={index} onTouchTap={e => { this.hideTheme() }}>
                  <CheckCircle color={color} />
                </IconButton>
              )
            } else {
              return (
                <IconButton style={style.small} iconStyle={style.smallIcon} key={index} onTouchTap={e => { this.switchTheme(index) }}>
                  <ImageLens color={color} />
                </IconButton>
              )
            }*/}
            const { name, color } = item
            return (
              <ListItem
                key={index}
                primaryText={name}
                leftIcon={<ImageLens color={color} />}
                rightIcon={<ActionDone color={color} style={{ display: currentTheme !== index ? 'none' : '' }} />}
                style={{ color: color }}
                onTouchTap={e => { this.switchTheme(index) }}
              />
            )
          })}
          <ListItem
            primaryText={intl.formatMessage({ id: 'theme.custom.label' })}
            leftIcon={<ImageColorize color={color} />}
            rightIcon={<ActionDone  color={color} style={{ display: currentTheme !== -1 ? 'none' : '' }} />}
            style={{ color: color }}
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
  const { data } = state.settings
  return { data }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(settingsActions, dispatch)
}

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(Theme))