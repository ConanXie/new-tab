import './style.less'

import classNames from 'classnames'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { initialData } from '../../actions/search-engines'

import muiThemeable from 'material-ui/styles/muiThemeable'
import RaisedButton from 'material-ui/RaisedButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import SearchIcon from 'material-ui/svg-icons/action/search'
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more'
import Paper from 'material-ui/Paper'
import SvgIcon from 'material-ui/SvgIcon'

import predict from './predict'

const WebIcon = props => {
  return (
    <SvgIcon {...props}>
      <path d="M14.36,12a16.52,16.52,0,0,0,.14-2,16.52,16.52,0,0,0-.14-2h3.38A8.24,8.24,0,0,1,18,10a8.24,8.24,0,0,1-.26,2m-5.15,5.56A15.65,15.65,0,0,0,14,14h2.95a8,8,0,0,1-4.33,3.56M12.34,12H7.66a13.27,13.27,0,0,1-.16-2,13.16,13.16,0,0,1,.16-2h4.68a14.58,14.58,0,0,1,.16,2,14.71,14.71,0,0,1-.16,2M10,18a13.56,13.56,0,0,1-1.91-4h3.82A13.56,13.56,0,0,1,10,18M6,6H3.08A7.92,7.92,0,0,1,7.4,2.44,17.23,17.23,0,0,0,6,6M3.08,14H6a17.23,17.23,0,0,0,1.4,3.56A8,8,0,0,1,3.08,14m-.82-2A8.24,8.24,0,0,1,2,10a8.24,8.24,0,0,1,.26-2H5.64a16.52,16.52,0,0,0-.14,2,16.52,16.52,0,0,0,.14,2M10,2a13.62,13.62,0,0,1,1.91,4H8.09A13.62,13.62,0,0,1,10,2m6.92,4H14a15.65,15.65,0,0,0-1.38-3.56A8,8,0,0,1,16.92,6M10,0A10,10,0,1,0,20,10,10,10,0,0,0,10,0Z"/>
    </SvgIcon>
  )
}

const style = {
  searchBtn: {
    width: '38px',
    height: '38px',
    padding: '0',
    position: 'absolute',
    right: '3px',
    top: '3px'
  },
  menuItem: {
    minWidth: '100px'
  }
}

class Search extends Component {
  static propsType = {
    settings: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      predictions: [],
      empty: true
    }
    // the default engine has rendered
    this.isDone = false
    // record the index of predictions, default value is -1
    this.predictionsIndex = -1
    // record current engine index
    this.engineIndex = 0
    // exec the host of engine's url
    this.pattern = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/
  }
  componentDidMount() {
    this.props.initialData()
    // disable spell check on search input
    this.refs.text.setAttribute('spellcheck', 'false')
  }
  componentWillReceiveProps(nextProps) {
    if (!this.isDone) {
      const { engines } = nextProps
      const theDefault = nextProps.engines.filter((engine, index) => {
        if (engine.isDefault) {
          this.engineIndex = index
        }
        return engine.isDefault
      })
      const { link, name } = theDefault[0]
      const host = this.pattern.exec(link)[3]
      this.setState({
        link,
        host,
        name
      })
      this.isDone = true
    }
    if (this.props.settings.searchPredict !== nextProps.settings.searchPredict && !nextProps.settings.searchPredict) {
      this.setState({
        predictions: []
      })
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    // if input is empty then prevent render of predictions change caused by network delay
    if (this.inputText === '' && nextState.predictions.length) {
      return false
    }
    
    return true
  }
  /**
   * open window to search
   */
  search = e => {
    e.preventDefault()
    this.openSearch(this.state.link)
  }
  openSearch(link) {
    const text = this.refs.text.value
    const target = this.props.settings.searchTarget ? '_blank' : '_self'
    window.open(link.replace('%s', text).replace(/\#/g, '%23'), target)
  }
  changeEngine = index => {
    const { name, link } = this.props.engines[index]
    const host = this.pattern.exec(link)[3]
    this.setState({
      link,
      host,
      name
    })
    this.engineIndex = index
    if (this.props.settings.searchPredict && !predict[host]) {
      this.setState({
        predictions: []
      })
    }
  }
  toTheNext = event => {
    let index = this.engineIndex
    if (index < this.props.engines.length - 1) {
      index +=  1
    } else {
      index = 0
    }
    this.changeEngine(index)
  }
  watchInput = async event => {
    // if input then set predictionsIndex to default
    this.predictionsIndex = -1
    const { host } = this.state
    const { searchPredict, remaining } = this.props.settings
    // if user turn on search predict
    if (searchPredict || remaining) {
      const text = event.target.value
      // record the input value as user type
      this.inputText = text
      if (text === '') {
        this.setState({
          predictions: [],
          empty: true
        })
      } else {
        this.setState({
          empty: false
        })
      }
    }
    if (searchPredict && predict[host]) {
      try {
        const predictions = await predict[host](this.inputText)
        // remove predictions 'active' class
        this.clearPredictionsClassName()
        this.setState({
          predictions
        })
      } catch (err) {
        console.error(err)
      }
    }
  }
  // hover style
  mouseEnter = () => {
    this.refs.text.classList.add('hover')
  }
  mouseLeave = () => {
    this.refs.text.classList.remove('hover')
  }
  documentMouseDown = e => {
    const wrapper = document.querySelector('.list-wrapper')
    // target area in the list wrapper then prevent default
    if (e.path.indexOf(wrapper) > 0) {
      e.preventDefault()
    }
  }
  documentKeyDown = e => {
    // up arrow
    if (e.keyCode === 38) {
      e.preventDefault()
    }
  }
  focus = event => {
    this.refs.text.classList.add('focus')
    const { searchPredict, remaining } = this.props.settings
    if (searchPredict || remaining) {
      this.setState({
        focus: true
      })
      this.watchInput(event)
      document.addEventListener('mousedown', this.documentMouseDown, false)
      document.addEventListener('keydown', this.documentKeyDown, false)
    }
  }
  blur = () => {
    // console.log('blur')
    this.refs.text.classList.remove('focus')
    this.setState({
      focus: false
    })
    document.removeEventListener('mousedown', this.documentMouseDown, false)
    document.removeEventListener('keydown', this.documentKeyDown, false)
    // restore remaining engines status
    if (this.props.settings.remaining && this.props.engines.length > 4 && this.refs.engines && this.refs.engines.dataset.expanded === '1') {
      this.toggleExpand()
    }
  }
  // select prediction via up or down arrow key
  selectPredictions = event => {
    const predictions = this.refs.predictions.querySelectorAll('li')
    const total = predictions.length
    const lastIndex = this.predictionsIndex
    switch (event.keyCode) {
      // down
      case 40:
        if (this.predictionsIndex !== total - 1) {
          this.predictionsIndex++
        } else {
          this.predictionsIndex = -1
        }
        break
      // up
      case 38:
        if (this.predictionsIndex === -1) {
          this.predictionsIndex = total - 1
        } else {
          this.predictionsIndex--
        }
        break
    }

    if (lastIndex !== this.predictionsIndex) {
      if (lastIndex !== -1) {
        // remove previous element class
        predictions[lastIndex].classList.remove('active')
      }
      
      if (this.predictionsIndex !== -1) {
        // change input value and add element class
        this.refs.text.value = predictions[this.predictionsIndex].innerText
        predictions[this.predictionsIndex].classList.add('active')
      } else {
        this.refs.text.value = this.inputText
      }
    }

  }
  clearPredictionsClassName = () => {
    const predictions = this.refs.predictions.querySelectorAll('li')
    predictions.forEach(li => {
      li.classList.remove('active')
    })
  }
  // mouse move on predictions
  predictionMouseEnter = event => {
    this.clearPredictionsClassName()
    event.target.classList.add('active')
    this.predictionsIndex = Number(event.target.dataset.index)
  }
  predictionMouseLeave = event => {
    event.target.classList.remove('active')
    this.predictionsIndex = -1
  }
  // search by click prediction
  searchPrediction = event => {
    this.setState({
      focus: false
    })
    this.refs.text.value = this.refs.predictions.childNodes[this.predictionsIndex].innerText
    this.search(event)
  }
  toggleExpand = event => {
    const remainder = this.calcRemainder()
    const ele = this.refs.engines
    const height = 24
    if (ele.dataset.expanded === '1') {
      ele.style.height = remainder * height + 'px'
      ele.dataset.expanded = 0
    } else {
      ele.style.height = (this.props.engines.length - 1) * height + 'px'
      ele.dataset.expanded = 1
    }
  }
  searchFrom(index) {
    this.openSearch(this.props.engines[index].link)
  }
  calcRemainder() {
    const {searchPredict, remaining } = this.props.settings
    if ((!searchPredict && remaining) || !predict[this.state.host]) {
      return 6
    } else {
      return 3
    }
  }
  render() {
    const { name, link, host, focus, predictions, empty } = this.state
    const { muiTheme, engines, settings } = this.props
    const { background, backgroundShade, darkMode, logoTransparency, transparentSearchInput, remaining } = settings

    let iconColor = muiTheme.palette.textColor // menu icon color
    let logoColor = muiTheme.palette.primary1Color // logo background-color for -webkkit-mask
    let textColor = iconColor // input text color
    if (!darkMode && background) {
      // Light background
      if (backgroundShade === 2) {
        iconColor = 'rgba(255, 255, 255, 0.87)'
      }
      // logo color equal with menu icon color when using wallpaper
      logoColor = iconColor
      if (transparentSearchInput) {
        textColor = iconColor
      }
    }
    const remainder = this.calcRemainder()

    return (
      <div className="search-wrapper">
        <div className="logo-area">
          <div
            className={classNames('logo',  { 'white': !darkMode && background && backgroundShade === 2 })}
            data-host={host}
            onClick={this.toTheNext}
            style={{ backgroundColor: logoColor, opacity: logoTransparency }}
          ></div>
          <span className="engine-name" style={{ color: logoColor, opacity: logoTransparency }}>{name}</span>
          <IconMenu
            className="engines-menu"
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            value={this.engineIndex}
            iconStyle={{ color: iconColor }}
            maxHeight={280}
          >
            {engines.map((engine, index) => {
              const { id, name } = engine
              return (
                <MenuItem
                  key={id}
                  value={index}
                  primaryText={name}
                  onClick={e => this.changeEngine(index)}
                  innerDivStyle={style.menuItem}
                />
              )
            })}
          </IconMenu>
        </div>
        <div className="search-box">
          <form action="" onSubmit={this.search} autoComplete="off">
            <div className="input-box">
              <input
                type="text"
                tabIndex="1"
                id="search-input"
                className={classNames({ 'night': darkMode })}
                ref="text"
                onInput={this.watchInput}
                onMouseEnter={this.mouseEnter}
                onMouseLeave={this.mouseLeave}
                onFocus={this.focus}
                onBlur={this.blur}
                onKeyUp={this.selectPredictions}
                style={{ color: textColor, backgroundColor: transparentSearchInput ? 'transparent' : '' }}
              />
              <IconButton
                type="submit"
                style={style.searchBtn}
                iconStyle={{ color: muiTheme.palette.primary1Color, opacity: transparentSearchInput ? 0 : '' }}
              >
                <SearchIcon />
              </IconButton>
              <div className="list-wrapper">
                {remaining && !empty && (
                  <Paper className={classNames('list-box', { 'show': focus })}  zDepth={1} style={{ backgroundColor: muiTheme.paper.backgroundColor }}>
                    <ul ref="engines" className="engines-list" data-expanded="0" style={{ height: (engines.length < remainder + 1 ? engines.length - 1 : remainder) * 24 }}>
                      {engines.map((engine, index) => {
                        const { id, name } = engine
                        if (index !== this.engineIndex) {
                          return (
                            <li
                              key={id}
                              onClick={() => { this.searchFrom(index) }}
                            >
                              {chrome.i18n.getMessage('search.from')} <span style={{ color: muiTheme.palette.primary1Color }}>{name}</span>
                            </li>
                          )
                        }
                      })}
                    </ul>
                    {engines.length > 4 && (
                      <div className="expand-more" onClick={this.toggleExpand}>
                        <IconButton
                          style={{ padding: 0, width: 'auto', height: 'auto' }}
                          iconStyle={{ color: muiTheme.palette.primary1Color, opacity: transparentSearchInput ? 0 : '' }}
                          >
                          <ExpandMore />
                        </IconButton>
                      </div>
                    )}
                  </Paper>
                )}
                <Paper className={classNames('list-box', { 'show': focus })} zDepth={1} style={{ backgroundColor: muiTheme.paper.backgroundColor }}>
                  <ul ref="predictions">
                    {predictions && predictions.map((v, i) => {
                      return (
                        <li
                          key={Math.random()}
                          data-index={i}
                          onMouseEnter={this.predictionMouseEnter}
                          onMouseLeave={this.predictionMouseLeave}
                          onClick={this.searchPrediction}
                          dangerouslySetInnerHTML={{ __html: v }}
                        ></li>
                      )
                    })}
                  </ul>
                </Paper>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { settings, searchEngines } = state
  return {
    engines: searchEngines.engines,
    settings
  }
}

export default muiThemeable()(connect(mapStateToProps, { initialData })(Search))
