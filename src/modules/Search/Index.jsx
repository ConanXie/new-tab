import './style.less'

import classNames from 'classnames'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as searchEngineActions from '../../actions/search-engines'

import muiThemeable from 'material-ui/styles/muiThemeable'
import RaisedButton from 'material-ui/RaisedButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import SearchIcon from 'material-ui/svg-icons/action/search'
import Paper from 'material-ui/Paper'

import searchEngine from './search-engines'

// 大陆以外地区去掉百度与搜狗
if (navigator.language !== 'zh-CN') {
  searchEngine.splice(1, 2)
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
    currentEngine: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    saveEngine: PropTypes.func.isRequired,
    saveToLocalStorage: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
    const { currentEngine, saveEngine, saveToLocalStorage, settings } = this.props

    let origin
    // currentEngine not exist, or autoSaveEngine is false
    if (!currentEngine.predict || !settings.autoSaveEngine) {
      origin = searchEngine[0]
      saveEngine(origin)
      saveToLocalStorage(origin)
    } else {
      origin = currentEngine
    }
    const { link, predict, name, className } = origin
    this.state = {
      searchLink: link,
      searchPredict: predict,
      searchName: name,
      searchClass: className
    }
    // record the index of predictions, default value is -1
    this.predictionsIndex = -1
  }
  componentDidMount() {
    // this.refs.text.focus()
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
    const { settings, saveEngine, saveToLocalStorage } = this.props
    saveEngine(engine)
    if (settings.autoSaveEngine) {
      saveToLocalStorage(engine)
    }
  }
  watchInput = event => {
    const _this = this
    // if input then set predictionsIndex to default
    this.predictionsIndex = -1
    // if user turn on search predict
    if (this.props.searchPredict) {
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
      const now = Date.now()
      
      if (!this.interval) {
        this.interval = now
      } else {
        if (now - this.interval < 200) {
          this.interval = now
          return
        }
      }

        
      fetch(this.state.searchPredict.replace('%l', navigator.language).replace('%s', text) + `&r=${Date.now()}`).then(res => {
        if (res.ok) {
          // extract the encoding of response headers, e.g. UTF-8
          const encoding = /[\w\-]+$/.exec(res.headers.get('Content-Type'))[0]
          // analysis response body as blob and read as file with the current encoding
          res.blob().then(blob => {
            const reader = new FileReader()

            reader.onload = e => {
              const text = reader.result
              const results = this.analysisData(this.state.searchName, text)
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
      case searchEngine[0].name:
      case searchEngine[3].name:
        formatted = JSON.parse(data)
        formatted[1].forEach((v, i) => {
          results.push(v[0])
        })
        break
      // Baidu
      case searchEngine[1].name:
        formatted = JSON.parse(data.replace(/^window\.baidu\.sug\(/, '').replace(/\);$/, ''))
        formatted.s.forEach((v, i) => {
          results.push(v)
        })
        break
      // Sogou
      case searchEngine[2].name:
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
  selectForcast = (event) => {
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
    const { muiTheme } = this.props
    return (
      <div className="search-wrapper">
        <div className={`search-logo ${searchClass}`}>
          <IconMenu
            className="more-engine"
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            iconStyle={{ color: muiTheme.palette.textColor }}
          >
            {searchEngine.map(value => {
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
                onKeyUp={this.selectForcast}
                style={{ color: muiTheme.palette.textColor }}
              />
              <IconButton
                type="submit"
                style={style.searchBtn}
                iconStyle={{
                  color: '#666'
                }}
              >
                <SearchIcon />
              </IconButton>
              <Paper className={classNames('predictions-box', { 'show': showPredictions })} zDepth={1} style={{ backgroundColor: muiTheme.paper.backgroundColor }}>
                <ul ref="predictions">
                  {predictions && predictions.map((v, i) => {
                    return (
                      <li
                        key={Math.random()}
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
  const { currentEngine } = state.searchEngine
  const { data } = state.settings
  return { currentEngine, settings: data }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(searchEngineActions, dispatch)
}
export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(Search))