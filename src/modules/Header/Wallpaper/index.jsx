import './style.less'

import { canvasRGB } from 'stackblur-canvas'
import shortid from 'shortid'
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
import Snackbar from 'material-ui/Snackbar'
import LinearProgress from 'material-ui/LinearProgress'
import ActionOpacity from 'material-ui/svg-icons/action/opacity'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import BlurOn from 'material-ui/svg-icons/image/blur-on'

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
    margin: '0 auto',
    width: 'calc(100% - 12px)'
  },
  sliderIcon: {
    margin: '0 22px 0 -2px'
  },
  dialogContent: {
    width: '380px'
  },
  dialogBody: {
    padding: '16px 0'
  },
  progress: {
    position: 'absolute',
    bottom: '0'
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
      colorDialogOpen: false,
      snackbarOpen: false,
      snackbarMessage: '',
      fetching: false
    }
    this.checkColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    this.spaceSize = 10 * 1024 * 1024
    this.canvasWidth = 570
  }
  componentDidMount() {
    const errorHandler = this.errorHandler
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    // canvas.width = this.canvasWidth
    window.webkitRequestFileSystem(window.TEMPORARY, this.spaceSize, fs => {
      fs.root.getFile('wallpaper.jpg', { create: false }, fileEntry => {
        fileEntry.file(file => {
          const fr = new FileReader()

          fr.onloadend = () => {
            this.originImage = fr.result
            /*const img = new Image()
            img.src = this.originImage
            img.onload = () => {
              // const width = this.canvasWidth
              // const height = Math.round(this.canvasWidth * img.height / img.width)
              const { width, height } = img
              // const { width, height } = window.screen
              canvas.width = width
              canvas.height = height
              console.log(width, height)
              ctx.drawImage(img, 0, 0, width, height)
              console.time('blur')
              canvasRGB(canvas, 0, 0, width, height, 0)
              console.timeEnd('blur')
              // document.body.appendChild(canvas)
              canvas.toBlob(blob => {
                fs.root.getFile('wallpaper-blur.jpg', { create: true }, fileEntry => {
                  fileEntry.createWriter(fileWriter => {
                    fileWriter.onerror = e => console.error(e)
                    fileWriter.onwriteend = function () {
                      this.truncate(this.position)
                      document.querySelector('#app').style.backgroundImage = `url(filesystem:chrome-extension://${chrome.app.getDetails().id}/temporary/wallpaper-blur.jpg)`
                    }
                    fileWriter.write(blob)
                  }, errorHandler)
                }, errorHandler)
              }, 'image/jpg')
            }*/
          }
          
          fr.readAsDataURL(file)
        })
      }, errorHandler)
    }, errorHandler)
  }
  handleTransparency = (event, value) => {
    /*this.setState({
      opacity: value
    })*/
    document.querySelector('.logo').style.opacity = 1 - value
  }
  applyTransparency = () => {
    const { saveSettings } = this.props
    const radius = document.querySelector('[name=radius]').value * 1
  }
  handleSourceChange = (event, index, value) => {
    this.setState({
      source: value
    })
    const saveSource = () => {
      this.props.saveSettings({
        backgroundSource: value
      })
    }
    if (value === 1) {
      /*// const url = `https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=${navigator.language}`
      const url = `http://localhost:5300/api/wallpaper/${window.screen.width}x${window.screen.height}`
      fetch(url).then(res => {
        if (res.ok) {
          return res.json()
        }
      }).then(data => {
        // const imageUrl = 'https://www.bing.com' + data.images[0].url
        const imageUrl = data.result[0].url
        // console.log(imageUrl)
        fetch(imageUrl).then(res => {
          if (res.ok) {
            return res.blob()
          }
        }).then(data => {
          const fr = new FileReader()
          fr.onloadend = () => {
            this.originImage = fr.result
            const radius = this.props.settings.blurRadius
            if (radius) {
              this.saveImage(data, () => this.saveBlurImage(radius, saveSource))
            } else {
              this.saveImage(data, saveSource)
            }
          }
          fr.readAsDataURL(data)
        }).catch(e => console.error(e))
      }).catch(e => console.error(e))*/
      this.fetchWallpaper()
      // return
    }
    saveSource()
  }
  fetchWallpaper = async () => {
    if (this.state.fetching) {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: 'A new wallpaper is fetching'
      })
      return
    }
    this.setState({
      fetching: true
    })
    const { width, height } = window.screen
    const url = `http://localhost:5300/api/wallpaper/${width}x${height}`
    try {
      const res = await fetch(url)
      const msg = await res.json()
      const image = await fetch(msg.result[0].url)
      if (!image.ok) {
        this.setState({
          snackbarOpen: true,
          snackbarMessage: 'Fetch failed',
          fetching: false
        })
        return
      }
      const data = await image.blob()
      const { blurRadius } = this.props.settings
      if (blurRadius) {
        this.saveImage(data, () => this.saveBlurImage(blurRadius, () => this.updateBackgroundImageUrl(1)))
      } else {
        this.saveImage(data, this.updateBackgroundImageUrl)
      }
      this.setState({
        fetching: false
      })
      const fr = new FileReader()
      fr.onloadend = () => this.originImage = fr.result
      fr.readAsDataURL(data)
    } catch (e) {
      this.errorHandler(e)
    }
    
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
    const { blurRadius } = this.props.settings
    const file = event.target.files[0]
    const { type, size } = file
    // console.log(type, size)
    if (!/image\/(jpg|jpeg|png|gif)/.test(type)) {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: 'This file is not supported'
      })
      return
    }
    if (size > this.spaceSize) {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: 'This image is too large'
      })
      return
    }

    const fr = new FileReader()
    fr.onloadend = () => {
      this.originImage = fr.result
      const buffer = this.base64ToBinary(this.originImage)
      const { blurRadius } = this.props.settings
      const blob = new Blob([buffer], { type: 'image/jpg' })
      if (blurRadius) {
        this.saveImage(blob)
        this.saveBlurImage(blurRadius, () => this.updateBackgroundImageUrl(1))
      } else {
        this.saveImage(blob, this.updateBackgroundImageUrl)
      }
    }
    fr.readAsDataURL(file)
  }
  updateBackgroundImageUrl(blur) {
    document.querySelector('#app').style.backgroundImage = `url(filesystem:chrome-extension://${chrome.app.getDetails().id}/temporary/wallpaper${blur ? '-blur' : ''}.jpg?r=${Date.now()})`
  }
  handleBlur = (event, value) => {
    // console.log(value)
  }
  applyBlur = event => {
    const { saveSettings } = this.props
    const radius = document.querySelector('[name=radius]').value * 1
    const saveRadius = () => {
      saveSettings({ blurRadius: radius })
    }
    if (!radius) {
      saveRadius()
      return
    }
    this.saveBlurImage(radius, saveRadius)
    
  }
  saveImage(blob, callback) {
    const errorHandler = this.errorHandler
    window.webkitRequestFileSystem(window.TEMPORARY, this.spaceSize, fs => {
      fs.root.getFile('wallpaper.jpg', { create: true }, fileEntry => {
        fileEntry.createWriter(fileWriter => {
          let truncated = false
          fileWriter.onerror = e => console.error(e)
          fileWriter.onwriteend = function () {
            if (!truncated) {
              truncated = true
              this.truncate(this.position)
              return
            }
            if (typeof callback === 'function') {
              callback()
            }
          }
          fileWriter.write(blob)
        }, errorHandler)
      }, errorHandler)
    }, errorHandler)
  }
  saveBlurImage(radius, callback) {
    const errorHandler = this.errorHandler
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const image = new Image()
    image.src = this.originImage
    image.onload = () => {
      const { width, height } = image
      canvas.width = width
      canvas.height = height
      ctx.drawImage(image, 0, 0, width, height)
      console.time('blur')
      canvasRGB(canvas, 0, 0, width, height, radius)
      console.timeEnd('blur')
      canvas.toBlob(blob => {
        window.webkitRequestFileSystem(window.TEMPORARY, this.spaceSize, fs => {
          fs.root.getFile('wallpaper-blur.jpg', { create: true }, fileEntry => {
            fileEntry.createWriter(fileWriter => {
              let truncated = false
              fileWriter.onerror = e => console.error(e)
              fileWriter.onwriteend = function () {
                if (!truncated) {
                  truncated = true
                  this.truncate(this.position)
                  return
                }
                console.log(Date.now())
                // saveSettings({ blurRadius: radius })
                if (typeof callback === 'function') {
                  callback()
                }
              }
              fileWriter.write(blob)
            }, errorHandler)
          }, errorHandler)
        }, errorHandler)
      }, 'image/jpg')
    }
  }
  saveToLocal = async () => {
    try {
      const res = await fetch(this.originImage)
      const data = await res.blob()
      const a = document.createElement('a')
      a.href = window.URL.createObjectURL(data)
      a.download = shortid.generate() + '.jpg'
      a.click()
    } catch (err) {
      this.errorHandler(err)
    }
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
    const { source, color, shade, colorDialogOpen, opacity, snackbarOpen, snackbarMessage, fetching } = this.state
    const { darkMode, topShadow, background, blurRadius, hideWebsites } = settings

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
              <Checkbox
                label="顶部阴影"
                labelPosition="left"
                defaultChecked={settings.topShadow}
                onCheck={(event, bool) => saveSettings({ topShadow: bool })}
                labelStyle={styles.radioLabel}
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
                <MenuItem value={1} primaryText="Internet Wallpaper" />
                <MenuItem value={2} primaryText="Local Wallpaper" />
                <MenuItem value={3} primaryText="Solid Color" />
              </SelectField>
            </div>
            <div>
              {source === 1 && (
                <div>
                  <div className="fetch-new">
                    <ListItem
                      primaryText="New one"
                      secondaryText="Click to fetch a new wallpaper"
                      disabled={darkMode || !background}
                      innerDivStyle={styles.listItem}
                      onTouchTap={this.fetchWallpaper}
                    />
                    {fetching && (
                      <LinearProgress style={styles.progress} />
                    )}
                  </div>
                  <ListItem
                    primaryText="Download it"
                    secondaryText="Save the current wallpaper to local"
                    disabled={darkMode || !background}
                    innerDivStyle={styles.listItem}
                    onTouchTap={this.saveToLocal}
                  />
                </div>
              )}
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
            {source !== 3 && (
              <div className="border">
                <h3 style={{ color: muiTheme.palette.secondaryTextColor }}>壁纸模糊半径</h3>
                <div className="slider-wrap">
                  <BlurOn color={muiTheme.palette.secondaryTextColor} style={styles.sliderIcon} />
                  <Slider
                    disabled={darkMode || !background}
                    value={blurRadius}
                    step={1}
                    min={0}
                    max={100}
                    name="radius"
                    onChange={this.handleBlur}
                    onDragStop={this.applyBlur}
                    sliderStyle={styles.slider}
                  />
                </div>
              </div>
            )}
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
            <h2 style={{ color: muiTheme.palette.primary1Color }}>Search</h2>
            <div className="column">
              <Toggle
                label="隐藏搜索"
                defaultToggled={settings.hideSearch}
                onToggle={(event, bool) => saveSettings({ hideSearch: bool })}
              />
            </div>
            <div className="column">
              <Checkbox
                disabled={settings.hideSearch}
                label="输入框透明"
                labelPosition="left"
                defaultChecked={settings.transparentSearchInput}
                onCheck={(event, bool) => saveSettings({ transparentSearchInput: bool })}
                labelStyle={styles.radioLabel}
              />
            </div>
            <div className="border">
              <h3 style={{ color: muiTheme.palette.secondaryTextColor }}>Logo透明度</h3>
              <div className="slider-wrap">
                <ActionOpacity color={muiTheme.palette.secondaryTextColor} style={styles.sliderIcon} />
                <Slider
                  disabled={settings.hideSearch}
                  value={settings.logoTransparency}
                  name="transparency"
                  onChange={this.handleTransparency}
                  onDragStop={this.applyTransparency}
                  sliderStyle={styles.slider}
                />
              </div>
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
            <div className="column">
              <Checkbox
                label="文字阴影"
                labelPosition="left"
                labelStyle={styles.radioLabel}
              />
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
        <Snackbar
          open={snackbarOpen}
          message={snackbarMessage}
          autoHideDuration={2000}
          onRequestClose={() => this.setState({ snackbarOpen: false })}
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
