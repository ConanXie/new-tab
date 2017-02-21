import './style.less'

import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Paper from 'material-ui/Paper'
import { List, ListItem } from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
import ActionSearch from 'material-ui/svg-icons/action/search'
import ContentClear from 'material-ui/svg-icons/content/clear'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import FileFolder from 'material-ui/svg-icons/file/folder'
import FolderOpen from 'material-ui/svg-icons/file/folder-open'

const style = {
  listItem: {
    padding: '8px 16px'
  },
  bookmark: {
    padding: '8px 16px 8px 42px'
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
                  <input type="text" placeholder={intl.formatMessage({ id: 'bookmarks.search.placeholder' })} ref="search" onChange={this.watchInput} />
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
        <section className={classNames('result', { 'empty': !result.length && finished })}>
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
    // data: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    level: PropTypes.number.isRequired
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
    /*chrome.bookmark.get(this.props.id, d => {
      this.setState({
        title: d.title
      })
    })*/
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
    const paddingLeft = padding * level

    const Lists = data.map(i => {
      const children = i.children
      const title = i.title
      const url = i.url
      const id = i.id
      const parentId = i.parentId
      const isFolder = i.dateGroupModified || children || typeof url == 'undefined'

      if (isFolder) {
        return <Folder key={id} id={id} title={title} isOpen={false} level={level} />
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
    
    if (!generated) {
      this.createTree()
    } else {
      this.setState({
        folderStatus: folderStatus === 'closed' ? 'opened' : 'closed'
      })
    }
    /* else if (folderStatus === 'closed') {
      this.refs.children.style.display = 'block'
      this.setState({
        folderStatus: 'opened'
      })
    } else {
      this.refs.children.style.display = 'none'
      this.setState({
        folderStatus: 'closed'
      })
    }*/
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
      search: false,
      bookmarks: [],
      currentChildren: [],
      opens: ['1']
    }
  }
  generateBookmarks = (data, level = 0) => {
    // const generate = (data, level = 0) => {
      // const paddingLeft = 34 * level
      const paddingLeft = 16 * level
      const group = (level == 0) ? 'tree' : 'group'
      // const Wrap = <List>{this.props.children}</List>
      /*for (let i = 0; i < data.length; i++) {
        const d = data[i]
        const children = d.children
        const title = d.title.htmlspecialchars()
        const url = d.url
        const id = d.id
        const parentId = d.parentId
        // const idHTML = id ? 
        const isFolder = d.dateGroupModified || children || typeof url == 'undefined'
        let Item
        if (isFolder) {
          Item = <ListItem>{title}</ListItem>
        } else {
          Item = <ListItem>{title}</ListItem>
        }
      }*/
      let Items
      if (data.length) {
        Items = data.map(i => {
          const children = i.children
          const title = i.title
          const url = i.url
          const id = i.id
          const parentId = i.parentId
          const isFolder = i.dateGroupModified || children || typeof url == 'undefined'
          if (isFolder) {
            const isOpen = this.state.opens.indexOf(id) != -1
            // const isOpen = true
            /*if (isOpen) {
              return (
                <div key={id}>
                  <div>
                    <ListItem
                      primaryText={title}
                      className="folder"
                      innerDivStyle={style.bookmark}
                      style={{ paddingLeft }}
                      leftIcon={<FolderOpen style={{ margin: 4 }} />}
                      onTouchTap={e => { this.folderStatus(e, id, level + 1) }}
                    />
                    <div className="children-wrap">
                      {this.generateBookmarks(children, level + 1)}
                    </div>
                  </div>
                </div>
              )
            } else {
              return (
                <div key={id}>
                  <div>
                    <ListItem
                      key={id}
                      primaryText={title}
                      className="folder"
                      innerDivStyle={style.bookmark}
                      style={{ paddingLeft }}
                      leftIcon={<FileFolder style={{ margin: 4 }} />}
                      onTouchTap={e => { this.folderStatus(e, id, level + 1) }}
                    />
                    <div className="children-wrap"></div>
                  </div>
                </div>
              )
            }*/
            return <Folder key={id} id={id} title={title} isOpen={isOpen} level={level} />
          } else {
            return (
              <ListItem
                key={id}
                primaryText={title}
                className="bookmark"
                innerDivStyle={style.bookmark}
                style={{ paddingLeft }}
                leftIcon={<div style={{ width: 16, height: 16, margin: 8, content: `-webkit-image-set(url("chrome://favicon/size/16@1x/${url}") 1x, url("chrome://favicon/size/16@2x/${url}") 2x)` }}></div>}
              />
            )
          }
        })
      }
      return <List key={data.id}>{Items}</List>
    // }
  }
  componentDidMount() {
    setTimeout(() => {
      chrome.bookmarks.getTree(tree => {
        const { opens } = this.state
        const data = tree[0].children
        let bookmarks
        if (data) {
          const result = data.map(i => {
            const title = i.title
            const id = i.id
            const level = 0
            const isOpen = opens.indexOf(id) != -1
            // const isOpen = true
            
            return (
              <Folder key={id} id={id} title={title} isOpen={isOpen} level={level} />
            )
          })
          bookmarks = <List>{result}</List>
        }
        this.setState({
          bookmarks
        })
      })
    }, 1000)
    /**
     * create bookmarks data
     */
    /*chrome.bookmarks.getTree((bookmarks) => {
      console.log(bookmarks)
      const data = []
      const iteration = function (value, index) {
        if (value.children) {
          const _index = data.length
          data[_index] = {
            name: value.title,
            children: []
          }
          value.children.forEach((v, i) => {
            if (v.children) {
              const v_index = data.length
              data[v_index] = {
                name: v.title,
                children: []
              }
              v.children.forEach((m, n) => {
                iteration(m, v_index)
              })
            } else {
              data[_index].children.push(v)
            }
          })
        } else {
          data[index].children.push(value)
        }
      }
      bookmarks[0].children.forEach((value, index) => {
        iteration(value)
      })
      this.setState({
        bookmarks: data,
        currentChildren: data[0].children
      })
    })*/
    // this.generateBookmarks()
  }
  /*folderStatus = (e, id, level) => {
    // chrome.bookmarks.get('1', v => { console.log(v) })
    const target = e.currentTarget
    const index = this.state.opens.indexOf(id)
    // open folder
    if (index === -1) {
      this.state.opens.push(id)
      const parentNode = target.parentNode.parentNode
      console.log(parentNode)
      chrome.bookmarks.getChildren(id, children => {
        const ChildrenLists = this.generateBookmarks(children, level)
        chrome.bookmarks.get(id, d => {
          console.log(d)
          const title = d[0].title
          const paddingLeft = (level - 1) * 16
          render((
            <MuiThemeProvider muiTheme={this.props.muiTheme}>
              <div>
                <ListItem
                  primaryText={title}
                  className="folder"
                  innerDivStyle={style.bookmark}
                  style={{ paddingLeft }}
                  leftIcon={<FolderOpen style={{ margin: 4 }} />}
                  onTouchTap={e => { this.folderStatus(e, id, level + 1) }}
                />
                <div className="children-wrap">{ChildrenLists}</div>
              </div>
            </MuiThemeProvider>
          ), parentNode)
        })
      })
    // close folder
    } else {
      this.state.opens.splice(index, 1)
    }
    // this.generateBookmarks()
  }*/
  /*getChildren = (index) => {
    this.setState({
      currentChildren: this.state.bookmarks[index].children
    })
  }*/
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
    const { bookmarks } = this.state
    const { intl } = this.context
    return (
      <div className="bookmark-component">
        <Paper zDepth={1}>
          <header style={{ backgroundColor: muiTheme.palette.primary1Color }}>
            <div className="search-box" onTouchTap={this.openSearch}>
              <div className="search-icon">
                <ActionSearch color="#fff" />
              </div>
              <div className="placeholder">{intl.formatMessage({ id: 'bookmarks.search.placeholder' })}</div>
            </div>
          </header>
        </Paper>
        <section className={classNames('folder-list', { 'empty': !bookmarks })}>
          {!bookmarks && (
            <p className="empty-text">{intl.formatMessage({ id: 'empty.text.bookmarks' })}</p>
          )}
          {bookmarks}
        </section>
        {/*<aside className="folder-list">
          <List>
            {this.state.bookmarks.map((value, index) => {
              return (
                <ListItem
                  primaryText={value.name}
                  onTouchTap={e => { this.getChildren(index) }}
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
        </section>*/}
        <Search open={this.state.search} muiTheme={muiTheme} close={this.closeSearch} />
      </div>
    )
  }
}

export default Bookmark