import './style.less'

import React, { Component } from 'react'

import ActionSearch from 'material-ui/svg-icons/action/search'

class Bookmark extends Component {
  constructor(props) {
    super(props)
    chrome.bookmarks.getTree((bookmarks) => {
      console.log(bookmarks)
      const data = {}
      const iteration = function (value) {
        if (value.children) {
          data[value.title] = []
          iteration(value.children)
        }
        value.forEach((v, i) => {
          data[value.title].push(v)
        })
      }
      bookmarks[0].children.forEach(iteration)
      console.log(data)
    })
  }
  render() {
    const { muiTheme } = this.props
    return (
      <div className="bookmark-component">
        <header style={{ backgroundColor: muiTheme.palette.primary1Color }}>
          <div className="search-box">
            <div className="search-icon">
              <ActionSearch color="#fff" />
            </div>
            <div className="placeholder">搜索书签</div>
          </div>
        </header>
        <aside className="folder-list">

        </aside>
      </div>
    )
  }
}

export default Bookmark