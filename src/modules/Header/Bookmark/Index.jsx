import './style.less'

import classNames from 'classnames'
import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'

import Paper from 'material-ui/Paper'
import { List, ListItem } from 'material-ui/List'
// import ListItem from 'material-ui/ListItem'
import IconButton from 'material-ui/IconButton'
import ActionSearch from 'material-ui/svg-icons/action/search'
import ContentClear from 'material-ui/svg-icons/content/clear'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'

const style = {
  listItem: {
    padding: '8px 16px'
  },
  bookmark: {
    padding: '8px 16px 8px 42px'
  }
}

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      result: [],
      clear: false
    }
  }
  /**
   * when component rendered then focus the input
   */
  componentDidUpdate() {
    findDOMNode(this.refs.search).focus()
  }
  componentWillReceiveProps(nextProps) {
    // when close Bookmark Component then restore the Search Component
    if (!nextProps.hidden) {
      setTimeout(() => {
        this.closeSearch()
      }, 300)
    }
  }
  watchInput = (e) => {
    clearTimeout(this.wait)
    const cond = e.target.value
    this.setState({
      clear: cond ? true : false
    })
    // if user stopped input then run searchBookmarks
    this.wait = setTimeout(() => {
      this.searchBookmarks(cond)
    }, 500)
  }
  searchBookmarks = (cond) => {
    chrome.bookmarks.search(cond, result => {
      this.setState({
        result
      })
      // console.log(result)
    })
  }
  closeSearch = () => {
    const { close } = this.props
    close()
    setTimeout(() => {
      this.clearSearch()
    }, 300)
  }
  clearSearch = () => {
    findDOMNode(this.refs.search).value = ''
    this.setState({
      result: [],
      clear: false
    })
  }
  render() {
    const { open, muiTheme } = this.props
    return (
      <div className={classNames('search-bookmarks', { 'show': open })}>
        <Paper zDepth={1}>
          <div className="search-header" style={{ backgroundColor: muiTheme.palette.primary1Color }}>
            <Paper zDepth={1} style={{ backgroundColor: '#fff' }}>
              <div className="search-box">
                <div className="util-btn back-btn">
                  <IconButton onTouchTap={this.closeSearch}>
                    <ArrowBack color="#767676" />
                  </IconButton>
                </div>
                <div className="input-box">
                  <input type="text" placeholder="搜索书签" ref="search" onChange={this.watchInput} />
                </div>
                <div className={classNames('util-btn clear-btn', { 'show': this.state.clear })}>
                  <IconButton onTouchTap={this.clearSearch}>
                    <ContentClear color="#767676" />
                  </IconButton>
                </div>
              </div>
            </Paper>
          </div>
        </Paper>
        <section className="result">
          <List>
            {this.state.result.map((value, index) => {
              return (
                <a className="bookmark-link" href={value.url} key={index} title={value.title}>
                  <ListItem
                    primaryText={value.title}
                    leftIcon={<div style={{ width: 16, height: 16, margin: 8, content: `-webkit-image-set(url("chrome://favicon/size/16@1x/${value.url}") 1x, url("chrome://favicon/size/16@2x/${value.url}") 2x)` }}></div>}
                    className="bookmark"
                    innerDivStyle={style.bookmark}
                  />
                </a>
              )
            })}
          </List>
        </section>
      </div>
    )
  }
}

class Bookmark extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: false,
      bookmarks: {},
      currentChildren: [],
      folders: []
    }
  }
  componentDidMount() {
    /**
     * create bookmarks data
     */
    chrome.bookmarks.getTree((bookmarks) => {
      // console.log(bookmarks)
      const data = {}
      const iteration = function (value, folder) {
        if (value.children) {
          const _folder = value.title
          data[_folder] = []
          value.children.forEach((v, i) => {
            if (v.children) {
              data[v.title] = []
              v.children.forEach((m, n) => {
                iteration(m, v.title)
              })
            } else {
              data[_folder].push(v)
            }
          })
        } else {
          data[folder].push(value)
        }
      }
      bookmarks[0].children.forEach((value, index) => {
        iteration(value)
      })
      /**
       * create folders by data's key
       */
      const folders = []
      for (let i in data) {
        folders.push(i)
      }
      this.setState({
        bookmarks: data,
        currentChildren: data[folders[0]],
        folders
      })
    })
    
  }
  getChildren = (folder) => {
    this.setState({
      currentChildren: this.state.bookmarks[folder]
    })
  }
  openSearch = () => {
    this.setState({
      search: true
    })
  }
  closeSearch = () => {
    this.setState({
      search: false
    })
  }
  render() {
    const { muiTheme, hidden } = this.props
    return (
      <div className="bookmark-component">
        <header style={{ backgroundColor: muiTheme.palette.primary1Color }}>
          <div className="search-box" onTouchTap={this.openSearch}>
            <div className="search-icon">
              <ActionSearch color="#fff" />
            </div>
            <div className="placeholder">搜索书签</div>
          </div>
        </header>
        <aside className="folder-list">
          <List>
            {this.state.folders.map((value, index) => {
              return (
                <ListItem
                  primaryText={value}
                  onTouchTap={e => { this.getChildren(value) }}
                  key={index}
                  innerDivStyle={style.listItem}
                  className="folder"
                />
              )
            })}
          </List>
        </aside>
        <section className="bookmarks-sec">
          <List>
            {this.state.currentChildren.map((value, index) => {
              return (
                <a className="bookmark-link" href={value.url} key={index} title={value.title}>
                  <ListItem
                    primaryText={value.title}
                    leftIcon={<div style={{ width: 16, height: 16, margin: 8, content: `-webkit-image-set(url("chrome://favicon/size/16@1x/${value.url}") 1x, url("chrome://favicon/size/16@2x/${value.url}") 2x)` }}></div>}
                    className="bookmark"
                    innerDivStyle={style.bookmark}
                  />
                </a>
              )
            })}
          </List>
        </section>
        <Search open={this.state.search} muiTheme={muiTheme} close={this.closeSearch} hidden={hidden} />
      </div>
    )
  }
}

export default Bookmark