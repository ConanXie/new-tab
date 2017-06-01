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
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import ActionOpacity from 'material-ui/svg-icons/action/opacity'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

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
    margin: '24px 0',
  },
  radioLabel: {
    flex: 1
  },
  listItem: {
    paddingLeft: '16px',
    borderBottom: '1px solid rgba(200, 200, 200, 0.3)'
  },
  slider: {
    margin: '0'
  },
  opacityIcon: {
    marginRight: '18px'
  },
  dialogContent: {
    width: '380px'
  },
  dialogBody: {
    padding: '16px 0'
  },
}

class Wallpaper extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    const { backgroundSource, backgroundColor, backgroundShade } = props.settings
    this.state = {
      source: backgroundSource ? backgroundSource : 1,
      color: backgroundColor,
      shade: backgroundShade ? backgroundShade : 1,
      colorDialogOpen: false
    }
    this.checkColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
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
    this.props.saveSettings({
      backgroundSource: value
    })
  }
  errorHandler(e) {
    console.error(e)
  }
  base64ToBinary(imgUrl) {
    const BASE64_MARKER = ';base64,'
    const base64Index = imgUrl.indexOf(BASE64_MARKER) + BASE64_MARKER.length
    const base64 = imgUrl.substring(base64Index)
    const raw = window.atob(base64)
    const rawLength = raw.length
    const array = new Uint8Array(new ArrayBuffer(rawLength))

    for (let i = 0; i < rawLength; ++i) {
      array[i] = raw.charCodeAt(i)
    }
    return array
  }
  readImage = event => {
    const file = event.target.files[0]
    const fr = new FileReader()

    fr.onloadend = e => {
      const result = e.target.result
      document.querySelector('#app').style.backgroundImage = `url(${result})`
      webkitRequestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, fs => {
        fs.root.getFile('wallpaper.jpg', { create: true }, fileEntry => {
          fileEntry.createWriter(fileWriter => {
            fileWriter.onerror = e => console.error(e)
            const buffer = this.base64ToBinary(result)
            const image = new Blob([buffer], { type: 'image/jpg' })
            fileWriter.write(image)
          })
        })
      }, this.errorHandler)
    }

    fr.readAsDataURL(file)
  }
  showColorDialog = () => {
    const { backgroundColor } = this.props.settings

    this.setState({
      color: backgroundColor,
      colorDialogOpen: true
    })
  }
  hideColorDialog = () => {
    this.setState({
      colorDialogOpen: false
    })
  }
  handleColorInput = (e, value) => {
    this.setState({
      color: value
    })

    if (this.checkColor.test(value)) {
      this.refs.color.value = value
    }
  }
  getColor = e => {
    const value = e.target.value.toUpperCase()
    this.setState({ color: value })
  }
  setBackgroundColor = () => {
    const color = this.state.color.toUpperCase()
    const { saveSettings, settings } = this.props
    this.hideColorDialog()

    if (this.checkColor.test(color) && color !== settings.backgroundColor) {
      saveSettings({
        backgroundColor: color
      })
    }
  }
  handleShadeChange = (event, value) => {
    this.setState({
      shade: value
    })
    this.props.saveSettings({
      backgroundShade: value
    })
  }
  render() {
    const { intl } = this.context
    const { settings, saveSettings, muiTheme, closeDrawer } = this.props
    const { source, color, shade, colorDialogOpen } = this.state
    const { darkMode, topShadow, background, hideWebsites } = settings

    const colorActions = [
      <FlatButton
        label={intl.formatMessage({ id: 'button.cancel' })}
        primary={true}
        onTouchTap={this.hideColorDialog}
      />,
      <FlatButton
        label={intl.formatMessage({ id: 'button.confirm' })}
        primary={true}
        onTouchTap={this.setBackgroundColor}
      />
    ]

    return (
      <div className="wallpaper-settings">
        <Paper className="header-bar" style={{ backgroundColor: muiTheme.palette.primary1Color }} rounded={false} zDepth={1}>
          <div className="tool-bar">
            <div className="bar-left">
              <div className="bar-label" style={{ color: muiTheme.palette.alternateTextColor }}>Desktop</div>
            </div>
            <div className="bar-right">
              <IconButton onTouchTap={closeDrawer}>
                <NavigationClose color={muiTheme.palette.alternateTextColor} />
              </IconButton>
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
                label="使用壁纸"
                defaultToggled={settings.background}
                disabled={darkMode}
                onToggle={(event, bool) => { saveSettings({ background: bool }) }}
              />
            </div>
            <div className="column no-padding-right">
              <SelectField
                floatingLabelText="Choose wallpaper source"
                value={source}
                disabled={darkMode || !background}
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
                  disabled={darkMode || !background}
                  innerDivStyle={styles.listItem}
                >
                  <input type="file" style={styles.inputImage} accept="image/png, image/jpeg, image/gif, image/jpg" onChange={this.readImage} />
                </ListItem>
              )}
              {source === 3 && (
                <ListItem
                  primaryText="Pick a color"
                  secondaryText="Set background with custom color"
                  disabled={darkMode || !background}
                  innerDivStyle={styles.listItem}
                  onTouchTap={this.showColorDialog}
                />
              )}
            </div>
            <div className="border">
              <h3 style={{ color: muiTheme.palette.secondaryTextColor }}>壁纸颜色深浅</h3>
              <RadioButtonGroup
                name="hue"
                defaultSelected={shade}
                labelPosition="left"
                onChange={this.handleShadeChange}
              >
                <RadioButton
                  value={1}
                  label="浅色壁纸"
                  disabled={darkMode || !background}
                  style={styles.radio}
                  labelStyle={styles.radioLabel}
                />
                <RadioButton
                  value={2}
                  label="深色壁纸"
                  disabled={darkMode || !background}
                  style={styles.radio}
                  labelStyle={styles.radioLabel}
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
        <Dialog
          open={colorDialogOpen}
          actions={colorActions}
          onRequestClose={this.hideColorDialog}
          contentStyle={styles.dialogContent}
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

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(Wallpaper))
