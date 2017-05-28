import './style.less'

import classNames from 'classnames'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as settingsActions from '../../../actions/settings'

import muiThemeable from 'material-ui/styles/muiThemeable'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import Slider from 'material-ui/Slider'
import Toggle from 'material-ui/Toggle'
import Checkbox from 'material-ui/Checkbox'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import ActionOpacity from 'material-ui/svg-icons/action/opacity'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'

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
    margin: '16px 0',
  },
  listItem: {
    paddingLeft: '14px',
    borderBottom: '1px solid #eee'
  },
  slider: {
    margin: '0'
  },
  opacityIcon: {
    marginRight: '18px'
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
    const { settings, saveSettings, muiTheme, close } = this.props
    const { source } = this.state
    return (
      <div className="wallpaper-settings">
        <Paper className="header-bar" style={{ backgroundColor: muiTheme.palette.primary1Color }} rounded={false} zDepth={1}>
          <div className="tool-bar">
            <div className="bar-left">
              <IconButton onTouchTap={() => close()}>
                <ArrowBack color={muiTheme.palette.alternateTextColor} />
              </IconButton>
              <div className="bar-label" style={{ color: muiTheme.palette.alternateTextColor }}>Desktop</div>
            </div>
          </div>
        </Paper>
        <section>
          <div className="area">
            <h2 style={{ color: muiTheme.palette.primary1Color }}>Wallpaper</h2>
            <div className="column">
              <Toggle
                label="显示顶部阴影"
                defaultToggled={settings.topShadow}
                onToggle={(event, bool) => saveSettings({ topShadow: bool })}
              />
            </div>
            <div className="column">
              <Toggle
                label="使用背景壁纸"
                defaultToggled={settings.background}
                onToggle={(event, bool) => { saveSettings({ background: bool }) }}
              />
            </div>
            <div className="column no-padding-right">
              <SelectField
                floatingLabelText="Choose wallpaper source"
                value={source}
                disabled={!settings.background}
                fullWidth={true}
                underlineStyle={{ display: 'none' }}
                onChange={this.handleSourceChange}
              >
                <MenuItem value={1} primaryText="Bing Wallpaper" />
                <MenuItem value={2} primaryText="Local Wallpaper" />
                <MenuItem value={3} primaryText="Solid Color" />
              </SelectField>
            </div>
            <div>
              {source === 2 && (
                <ListItem
                  primaryText="Choose an image"
                  secondaryText="Set wallpaper with local image file"
                  innerDivStyle={styles.listItem}
                >
                  <input type="file" style={styles.inputImage} accept="image/*" onChange={this.restoreBackups} />
                </ListItem>
              )}
              {source === 3 && (
                <ListItem
                  primaryText="Pick a color"
                  secondaryText="Set background with custom color"
                  innerDivStyle={styles.listItem}
                />
              )}
            </div>
            <div className="border">
              <h3 style={{ color: muiTheme.palette.secondaryTextColor }}>背景明度</h3>
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
            </div>
          </div>
          <div className="area">
            <h2 style={{ color: muiTheme.palette.primary1Color }}>Websites</h2>
            <div className="column">
              <Toggle
                label="隐藏网站"
                defaultToggled={settings.hideWebsites}
                onToggle={(event, bool) => saveSettings({ hideWebsites: bool })}
              />
            </div>
            <div className="border">
              <h3 style={{ color: muiTheme.palette.secondaryTextColor }}>背景透明度</h3>
              <div className="opacity-wrap">
                <ActionOpacity color={muiTheme.palette.secondaryTextColor} style={styles.opacityIcon} />
                <Slider
                  disabled={settings.hideWebsites}
                  value={this.state.opacity}
                  onChange={this.handleOpacity}
                  sliderStyle={styles.slider}
                />
              </div>
            </div>
          </div>
        </section>
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
