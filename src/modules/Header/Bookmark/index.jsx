import './style.less'

import moment from 'moment'

import classNames from 'classnames'
import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types'

import muiThemeable from 'material-ui/styles/muiThemeable'
import Paper from 'material-ui/Paper'
import { Tabs, Tab } from 'material-ui/Tabs'
import SwipeableViews from 'react-swipeable-views'
import { List, ListItem } from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
import ActionSearch from 'material-ui/svg-icons/action/search'
import ContentClear from 'material-ui/svg-icons/content/clear'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import FileFolder from 'material-ui/svg-icons/file/folder'
import FolderOpen from 'material-ui/svg-icons/file/folder-open'
import ToggleStar from 'material-ui/svg-icons/toggle/star'

const style = {
  listItem: {
    padding: '8px 16px'
  },
  bookmark: {
    padding: '8px 16px 8px 42px'
  },
  header: {
    position: 'relative',
    zIndex: 1
  },
  searchHeader: {
    position: 'relative',
    zIndex: 2
  },
  managerButton: {
    position: 'relative',
    zIndex: 3,
    width: 40,
    height: 40,
    padding: 8
  },
  tooltip: {
    fontSize: '14px'
  }
}

class Search extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      result: [],
      clear: false,
      finished: false
    }
  }
  /**
   * when component rendered then focus the input
   */
  componentDidUpdate() {
    findDOMNode(this.refs.search).focus()
  }
  watchInput = (e) => {
    clearTimeout(this.wait)
    const cond = e.target.value
    this.setState({
      clear: cond ? true : false,
      finished: false
    })
    // if condition has more than 2 characters
    if (cond && cond.length > 1) {
      // if user stopped input then run searchBookmarks
      this.wait = setTimeout(() => {
        this.searchBookmarks(cond)
      }, 500)
    }
  }
  searchBookmarks = (cond) => {
    chrome.bookmarks.search(cond, result => {
      this.setState({
        result,
        finished: true
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
      clear: false,
      finished: false
    })
  }
  render() {
    const { open, muiTheme } = this.props
    const { result, finished } = this.state
    const { intl } = this.context
    return (
      <div className={classNames('search-bookmarks', { 'show': open })}>
        <Paper zDepth={1} style={style.searchHeader}>
          <div className="search-header" style={{ backgroundColor: muiTheme.palette.primary1Color }}>
            <Paper zDepth={1} style={{ backgroundColor: muiTheme.paper.backgroundColor }}>
              <div className="search-box">
                <div className="util-btn back-btn">
                  <IconButton onTouchTap={this.closeSearch}>
                    <ArrowBack color="#767676" />
                  </IconButton>
                </div>
                <div className="input-box">
                  <input
                    type="text"
                    placeholder={intl.formatMessage({ id: 'bookmarks.search.placeholder' })}
                    ref="search"
                    onChange={this.watchInput}
                    style={{ color: muiTheme.palette.textColor }}
                  />
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
        <section className={classNames('result', { 'empty': !result.length && finished })} style={{ backgroundColor: muiTheme.paper.backgroundColor }}>
          {!result.length && finished && (
            <p className="empty-text">{intl.formatMessage({ id: 'empty.text.bookmarks.search' })}</p>
          )}
          <List>
            {result.map((value, index) => {
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

// distance
const padding = 16

class Folder extends Component {
  static propsType = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    level: PropTypes.number.isRequired,
    opens: PropTypes.array.isRequired,
    recordFolders: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      folderStatus: 'closed',
      generated: false,
      ChildrenLists: ''
    }
  }
  componentWillMount() {
    const { isOpen } = this.props
    if (isOpen) {
      this.createTree()
    }
  }
  createTree = () => {
    const { id, level } = this.props
    chrome.bookmarks.getChildren(id, children => {
      this.count = children.length
      
      const ChildrenLists = this.generateChildren(children, level + 1)
      
      this.setState({
        folderStatus: 'opened',
        generated: true,
        ChildrenLists
      })
    })
  }
  generateChildren = (data, level) => {
    const { opens, recordFolders } = this.props
    const paddingLeft = padding * level
    
    const Lists = data.map(i => {
      const children = i.children
      const title = i.title
      const url = i.url
      const id = i.id
      const parentId = i.parentId
      const isFolder = i.dateGroupModified || children || typeof url == 'undefined'


      if (isFolder) {
        const isOpen = opens.indexOf(id) != -1
        return (
          <Folder
            key={id}
            id={id}
            title={title}
            level={level}
            isOpen={isOpen}
            opens={opens}
            recordFolders={recordFolders}
          />
        )
      } else {
        return (
          <a className="bookmark-link" href={url} key={id} title={title}>
            <ListItem
              primaryText={title}
              className="bookmark"
              innerDivStyle={style.bookmark}
              style={{ paddingLeft }}
              leftIcon={<div style={{ width: 16, height: 16, margin: 8, content: `-webkit-image-set(url("chrome://favicon/size/16@1x/${url}") 1x, url("chrome://favicon/size/16@2x/${url}") 2x)` }}></div>}
            />
          </a>
        )
      }
    })
    return Lists
  }
  changeStatus = () => {
    const { folderStatus, generated } = this.state
    const { recordFolders, id } = this.props
    if (!generated) {
      this.createTree()
    } else {
      this.setState({
        folderStatus: folderStatus === 'closed' ? 'opened' : 'closed'
      })
    }
    recordFolders(id)
  }
  render() {
    const { title, isOpen, level } = this.props
    const { folderStatus, ChildrenLists } = this.state

    let Icon = <FileFolder style={{ margin: 4 }} />
    if (folderStatus === 'opened') {
      Icon = <FolderOpen style={{ margin: 4 }} />
    }

    return (
      <div>
        <ListItem
          primaryText={title}
          className="folder"
          innerDivStyle={style.bookmark}
          style={{ paddingLeft: level * padding }}
          leftIcon={Icon}
          onTouchTap={e => { this.changeStatus() }}
        />
        <div className={classNames('children-wrap', { 'opened': folderStatus === 'opened' })}>
          {ChildrenLists}
        </div>
      </div>
    )
  }
}

class Bookmark extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      slideIndex: 0,
      search: false,
      bookmarks: [],
      recent: []
    }
    this.opens = []
  }
  componentWillReceiveProps(nextProps, nextState) {
    const { rememberBookmarksState } = nextProps

    // if cancel remember state then set scrollTop and opens to default
    if (!rememberBookmarksState) {
      localStorage.setItem('bookmarksScrollTop', 0)
      localStorage.setItem('bookmarksOpens', '[]')
    } else {
      // save current state to localStorage
      localStorage.setItem('bookmarksScrollTop', this.refs.wrapper.scrollTop)
      localStorage.setItem('bookmarksOpens', JSON.stringify(this.opens))
    }
  }
  handleChange = value => {
    this.setState({
      slideIndex: value
    })
  }
  // load bookmarks
  componentDidMount() {

    // get data from localStorage
    if (this.props.rememberBookmarksState) {
      this.opens = JSON.parse(localStorage.getItem('bookmarksOpens')) || []
      this.scrollTop = Number(localStorage.getItem('bookmarksScrollTop'))
    }

    setTimeout(() => {
      chrome.bookmarks.getTree(tree => {
        const data = tree[0].children
        let bookmarks
        if (data) {
          const results = data.map(i => {
            const title = i.title
            const id = i.id
            const level = 0
            const isOpen = this.opens.indexOf(id) !== -1
            
            return (
              <Folder
                key={id}
                id={id}
                title={title}
                level={level}
                isOpen={isOpen}
                opens={this.opens}
                recordFolders={this.recordFolders}
              />
            )
          })
          bookmarks = <List>{results}</List>
        }
        this.setState({
          bookmarks
        })
        setTimeout(() => {
          this.refs.wrapper.scrollTop = this.scrollTop
        }, 500)
      })
      // recent added bookmarks
      chrome.bookmarks.getRecent(30, results => {
        // console.log(results)
        this.setState({
          recent: results
        })
      })
    }, 500)
  }
  listenScroll = (event) => {
    // if user need to remember bookmarks state
    if (this.props.rememberBookmarksState) {
      localStorage.setItem('bookmarksScrollTop', event.target.scrollTop)
    }
  }
  recordFolders = (id) => {
    const index = this.opens.indexOf(id)
    if (index !== -1) {
      this.opens.splice(index, 1)
    } else {
      this.opens.push(id)
    }
    if (this.props.rememberBookmarksState) {
      localStorage.setItem('bookmarksOpens', JSON.stringify(this.opens))
    }
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
    const { muiTheme } = this.props
    const { bookmarks, recent, slideIndex } = this.state
    const { intl } = this.context
    return (
      <div className="bookmark-component">
        <Paper zDepth={2} style={style.header}>
          <header style={{ backgroundColor: muiTheme.palette.primary1Color }}>
            <div className="search-box" onTouchTap={this.openSearch}>
              <div className="search-icon">
                <ActionSearch color={muiTheme.palette.alternateTextColor} />
              </div>
              <div className="placeholder" style={{ color: muiTheme.palette.alternateTextColor }}>{intl.formatMessage({ id: 'bookmarks.search.placeholder' })}</div>
            </div>
            <IconButton
              tooltip={intl.formatMessage({ id: 'bookmarks.bookmarks.manager' })}
              tooltipPosition="bottom-left"
              tooltipStyles={style.tooltip}
              style={style.managerButton}
              onTouchTap={e => { chrome.tabs.update({ url: 'chrome://bookmarks/' }) }}
            >
              <ToggleStar color={muiTheme.palette.alternateTextColor} />
            </IconButton>
          </header>
          <Tabs
            onChange={this.handleChange}
            value={slideIndex}
            inkBarStyle={{ backgroundColor: muiTheme.palette.alternateTextColor }}
          >
            <Tab label={intl.formatMessage({ id: 'bookmarks.tabs.all' })} value={0} />
            <Tab label={intl.formatMessage({ id: 'bookmarks.tabs.recent' })} value={1} />
          </Tabs>
        </Paper>
        <SwipeableViews
          index={slideIndex}
          onChangeIndex={this.handleChange}
        >
          <section className={classNames('folder-list', { 'empty': !bookmarks })} ref="wrapper" onScroll={this.listenScroll}>
            {!bookmarks && (
              <p className="empty-text">{intl.formatMessage({ id: 'empty.text.bookmarks' })}</p>
            )}
            {bookmarks}
          </section>
          <section className={classNames('recent', { 'empty': !recent.length })}>
            {!recent.length && (
              <p className="empty-text">{intl.formatMessage({ id: 'empty.text.bookmarks.recent' })}</p>
            )}
            <List>
              {recent.map((value, index) => {
                return (
                  <a className="bookmark-link" href={value.url} key={index} title={value.title}>
                    <ListItem
                      primaryText={value.title}
                      secondaryText={moment(value.dateAdded).fromNow()}
                      leftIcon={<div style={{ width: 16, height: 16, margin: 8, content: `-webkit-image-set(url("chrome://favicon/size/16@1x/${value.url}") 1x, url("chrome://favicon/size/16@2x/${value.url}") 2x)` }}></div>}
                      className="bookmark"
                      innerDivStyle={style.bookmark}
                    />
                  </a>
                )
              })}
            </List>
          </section>
        </SwipeableViews>
        <Search open={this.state.search} muiTheme={muiTheme} close={this.closeSearch} />
      </div>
    )
  }
}

export default muiThemeable()(Bookmark)