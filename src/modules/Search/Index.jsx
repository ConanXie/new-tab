import './style.less'

import classNames from 'classnames'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as searchEnginesActions from '../../actions/search-engines'

import muiThemeable from 'material-ui/styles/muiThemeable'
import RaisedButton from 'material-ui/RaisedButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import SearchIcon from 'material-ui/svg-icons/action/search'
import Paper from 'material-ui/Paper'
import SvgIcon from 'material-ui/SvgIcon'

import defaultEngines from './search-engines'

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
  }
}

class Search extends Component {
  static propsType = {
    settings: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {}
    // the default engine has rendered
    this.isDone = false
    // record the index of predictions, default value is -1
    this.predictionsIndex = -1
    // record current engine index
    this.engineIndex = 0
  }
  componentWillReceiveProps(props) {
    if (!this.isDone) {
      const { engines, defaultIndex } = props
      const { link, predict, name, className } = engines[defaultIndex]
      this.setState({
        searchLink: link,
        searchPredict: predict,
        searchName: name,
        searchClass: className
      })
      this.isDone = true
      this.engineIndex = defaultIndex
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
  search = (e) => {
    e.preventDefault()
    const text = this.refs.text.value
    const { searchLink } = this.state
    const { currentEngine, useHK } = this.props
    // 判断是否使用.hk
    if (useHK && currentEngine.name === 'Google') {
      window.open(searchLink.replace(/\.com/, '.com.hk').replace('%s', text), this.props.target)
    } else {
      window.open(searchLink.replace('%s', text), this.props.target)
    }
  }
  changeEngine = (engine) => {
    const { name, link, predict, className } = engine
    this.setState({
      searchLink: link,
      searchPredict: predict,
      searchName: name,
      searchClass: className
    })
    /*const { settings, saveEngine, saveToLocalStorage } = this.props
    saveEngine(engine)
    if (settings.autoSaveEngine) {
      saveToLocalStorage(engine)
    }*/
  }
  toTheNext = event => {
    const { engines } = this.props
    if (this.engineIndex < engines.length - 1) {
      this.engineIndex += 1
    } else {
      this.engineIndex = 0
    }
    this.changeEngine(engines[this.engineIndex])
  }
  watchInput = event => {
    const _this = this
    // if input then set predictionsIndex to default
    this.predictionsIndex = -1
    const { searchName, searchPredict } = this.state
    // if user turn on search predict
    if (this.props.searchPredict && searchPredict) {
      // clearTimeout(this.delay)

      const text = event.target.value
      // record the input value as user type
      this.inputText = text
      if (text === '') {
        this.setState({
          predictions: []
        })
        return
      }

      // set a interval
      /*const now = Date.now()
      
      if (!this.interval) {
        this.interval = now
      } else {
        if (now - this.interval < 200) {
          this.interval = now
          return
        }
      }*/

        
      fetch(searchPredict.replace('%l', navigator.language).replace('%s', text) + `&r=${Date.now()}`).then(res => {
        if (res.ok) {
          // extract the encoding of response headers, e.g. UTF-8
          const encoding = /[\w\-]+$/.exec(res.headers.get('Content-Type'))[0]
          // analysis response body as blob and read as file with the current encoding
          res.blob().then(blob => {
            const reader = new FileReader()

            reader.onload = e => {
              const text = reader.result
              const results = this.analysisData(searchName, text)
              // remove predictions 'active' class
              _this.clearPredictionsClassName()
              this.setState({
                predictions: results
              })
            }

            reader.readAsText(blob, encoding)
          })
        }
      })
    }
  }
  /**
   * return the results of predicting
   */
  analysisData = (engine, data) => {
    const results = []
    let formatted
    switch (engine) {
      // Google and Bing
      case defaultEngines[0].name:
      case defaultEngines[3].name:
        formatted = JSON.parse(data)
        formatted[1].forEach((v, i) => {
          results.push(v[0])
        })
        break
      // Baidu
      case defaultEngines[1].name:
        formatted = JSON.parse(data.replace(/^window\.baidu\.sug\(/, '').replace(/\);$/, ''))
        formatted.s.forEach((v, i) => {
          results.push(v)
        })
        break
      // Sogou
      case defaultEngines[2].name:
        formatted = JSON.parse(data.replace(/^window\.sogou\.sug\(/, '').replace(/\,\-1\);$/, ''))
        formatted[1].forEach((v, i) => {
          results.push(v)
        })
        break
    }
    return results
  }
  // hover style
  mouseEnter = () => {
    this.refs.text.classList.add('hover')
  }
  mouseLeave = () => {
    this.refs.text.classList.remove('hover')
  }
  documentMouseDown = (e) => {
    // if the mousedown target is predictions then preventDefault
    if (e.target.dataset.name === 'prediction') {
      e.preventDefault()
    }
  }
  documentKeyDown = (e) => {
    // up arrow
    if (e.keyCode === 38) {
      e.preventDefault()
    }
  }
  focus = () => {
    this.refs.text.classList.add('focus')
    if (this.props.searchPredict) {
      this.setState({
        showPredictions: true
      })
      document.addEventListener('mousedown', this.documentMouseDown, false)
      document.addEventListener('keydown', this.documentKeyDown, false)
    }
  }
  blur = () => {
    // console.log('blur')
    this.refs.text.classList.remove('focus')
    this.setState({
      showPredictions: false
    })
    document.removeEventListener('mousedown', this.documentMouseDown, false)
    document.removeEventListener('keydown', this.documentKeyDown, false)
  }
  // select prediction via up or down arrow key
  selectPredictions = (event) => {
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
        this.refs.text.value = predictions[this.predictionsIndex].innerHTML
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
  predictionMouseEnter = (event) => {
    this.clearPredictionsClassName()
    event.target.classList.add('active')
    this.predictionsIndex = Number(event.target.dataset.index)
  }
  predictionMouseLeave = (event) => {
    event.target.classList.remove('active')
    this.predictionsIndex = -1
  }
  // search by click prediction
  searchPrediction = (event) => {
    this.setState({
      showPredictions: false
    })
    this.refs.text.value = event.target.innerHTML
    this.search(event)
  }
  render() {
    const { searchName, searchClass, showPredictions, predictions } = this.state
    const { muiTheme, engines } = this.props
    return (
      <div className="search-wrapper">
        <div className="logo-area">
          {!!searchClass && searchName && (
            <div className={`logo ${searchClass}`} onTouchTap={this.toTheNext}></div>
          )}
          {!searchClass && searchName && (
            <div className="default-logo" onTouchTap={this.toTheNext}>
              <WebIcon viewBox="0 0 20 20" style={{ width: 92, height: 92 }} color={muiTheme.palette.primary1Color} />
              <span>{searchName}</span>
            </div>
          )}
          <IconMenu
            className="more-engine"
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            iconStyle={{ color: muiTheme.palette.textColor }}
          >
            {engines.map(value => {
              return (
                <MenuItem
                  key={value.name}
                  primaryText={value.name}
                  onTouchTap={e => this.changeEngine(value)}
                  innerDivStyle={{minWidth: '100px'}}
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
                id="search-input"
                ref="text"
                onInput={this.watchInput}
                onMouseEnter={this.mouseEnter}
                onMouseLeave={this.mouseLeave}
                onFocus={this.focus}
                onBlur={this.blur}
                onKeyUp={this.selectPredictions}
                style={{ color: muiTheme.palette.textColor }}
              />
              <IconButton
                type="submit"
                style={style.searchBtn}
                iconStyle={{ color: '#666' }}
              >
                <SearchIcon />
              </IconButton>
              <Paper className={classNames('predictions-box', { 'show': showPredictions })} zDepth={1} style={{ backgroundColor: muiTheme.paper.backgroundColor }}>
                <ul ref="predictions">
                  {predictions && predictions.map((v, i) => {
                    return (
                      <li
                        key={v}
                        data-name="prediction"
                        data-index={i}
                        onMouseEnter={this.predictionMouseEnter}
                        onMouseLeave={this.predictionMouseLeave}
                        onMouseDown={this.predictionMouseDown}
                        onClick={this.searchPrediction}
                      >{v}</li>
                    )
                  })}
                </ul>
              </Paper>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { engines, defaultIndex } = state.searchEngines
  const { data } = state.settings
  return {
    engines,
    defaultIndex,
    settings: data
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(searchEnginesActions, dispatch)
}
export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(Search))