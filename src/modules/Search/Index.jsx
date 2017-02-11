import './style.less'

import React, { Component, PropTypes } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as searchEngineActions from '../../actions/search-engine'

import RaisedButton from 'material-ui/RaisedButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import SearchIcon from 'material-ui/svg-icons/action/search'

import searchEngine from './search-engine'

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

    // currentEngine not exist, or autoSaveEngine is false
    if (!currentEngine.name || !settings.autoSaveEngine) {
      const { link, name, className } = searchEngine[0]
      this.state = {
        searchLink: link,
        searchName: name,
        searchClass: className
      }
      saveEngine(searchEngine[0])
    } else {
      const { link, name, className } = currentEngine
      this.state = {
        searchLink: link,
        searchName: name,
        searchClass: className
      }
    }
  }
  search = (e) => {
    e.preventDefault()
    const text = this.refs.text.value
    const { searchLink } = this.state
    const { currentEngine, useHK } = this.props
    // 判断是否使用.hk
    if (useHK && currentEngine.name === 'Google') {
      window.open(searchLink.replace(/\.com/, '.com.hk') + text, this.props.target)
    } else {
      window.open(searchLink + text, this.props.target)
    }
  }
  changeEngine = (engine) => {
    const { name, link, className } = engine
    this.setState({
      searchLink: link,
      searchName: name,
      searchClass: className
    })
    const { settings, saveEngine, saveToLocalStorage } = this.props
    saveEngine(engine)
    if (settings.autoSaveEngine) {
      saveToLocalStorage(engine)
    }
  }
  mouseEnter = () => {
    this.refs.text.classList.add('hover')
  }
  mouseLeave = () => {
    this.refs.text.classList.remove('hover')
  }
  focus = () => {
    this.refs.text.classList.add('focus')
  }
  blur = () => {
    this.refs.text.classList.remove('focus')
  }
  render() {
    const { searchName, searchClass } = this.state
    return (
      <div className="search-wrapper">
        <div className={`search-logo ${searchClass}`}>
          <IconMenu
            className="more-engine"
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
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
          <form action="" onSubmit={this.search}>
            <div className="input-box">
              <input type="text" ref="text" onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onFocus={this.focus} onBlur={this.blur} />
              <IconButton
                type="submit"
                style={style.searchBtn}
                iconStyle={{
                  color: '#666'
                }}
              >
                <SearchIcon />
              </IconButton>
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
export default connect(mapStateToProps, mapDispatchToProps)(Search)