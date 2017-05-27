import './style.less'

import classNames from 'classnames'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as settingsActions from '../../../actions/settings'

import muiThemeable from 'material-ui/styles/muiThemeable'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import Slider from 'material-ui/Slider'
import Toggle from 'material-ui/Toggle'
import Checkbox from 'material-ui/Checkbox'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

const styles = {
  inputImage: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
  radio: {
    marginBottom: '16px',
  },
}

class Wallpaper extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      source: 1
    }
  }
  handleOpacity = (event, value) => {
    this.setState({
      opacity: value
    })
  }
  handleSourceChange = (event, index, value) => {
    this.setState({
      source: value
    })
  }
  render() {
    const { intl } = this.context
    const { settings, saveSettings } = this.props
    const { source } = this.state
    return (
      <div>
        <Toggle
          label="开启主屏幕背景"
          defaultToggled={settings.background}
          onToggle={(event, bool) => { saveSettings({ background: bool }) }}
        />
        <DropDownMenu
          value={source}
          onChange={this.handleSourceChange}
          disabled={!settings.background}
        >
          <MenuItem value={1} primaryText="Bing Wallpaper" />
          <MenuItem value={2} primaryText="Local Wallpaper" />
          <MenuItem value={3} primaryText="Solid Color" />
        </DropDownMenu>
        <div>
          {source === 2 && (
            <RaisedButton
              label="Choose an Image"
              containerElement="label"
            >
              <input type="file" style={styles.inputImage} />
            </RaisedButton>
          )}
          {source === 3 && (
            <TextField
              floatingLabelText={intl.formatMessage({ id: 'theme.input.placeholder' })}
              onChange={this.handleColorInput}
            />
          )}
        </div>
        <RadioButtonGroup
          name="hue"
          defaultSelected={1}
          onChange={this.handleHue}
        >
          <RadioButton
            value={1}
            label="浅色背景"
            disabled={!settings.background}
            style={styles.radio}
          />
          <RadioButton
            value={2}
            label="深色背景"
            disabled={!settings.background}
            style={styles.radio}
          />
        </RadioButtonGroup>
        <Toggle
          label="主屏幕顶部阴影"
          defaultToggled={settings.topShadow}
          onToggle={(event, bool) => { saveSettings({ topShadow: bool }) }}
        />
        <Toggle
          label="隐藏网站"
          defaultToggled={settings.hideWebsites}
          onToggle={(event, bool) => { saveSettings({ hideWebsites: bool }) }}
        />
        <Slider
          disabled={settings.hideWebsites}
          value={this.state.opacity}
          onChange={this.handleOpacity}
        />
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

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(Wallpaper))
