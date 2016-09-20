import './style.less'

import React, { Component } from 'react'

import RaisedButton from 'material-ui/RaisedButton'

class Search extends Component {
  constructor(props) {
    super(props)
  }
  search = (e) => {
    const text = this.refs.text.value
    window.open(`https://www.google.com/search?q=${text}`, '_self')
  }
  render() {
    return (
      <div className="search-wrapper">
        <div className="search-brand google"></div>
        <div className="search-box">
          <input type="text" ref="text" />
          <RaisedButton
            className="search-btn"
            label="google"
            onTouchTap={this.search}
          />
        </div>
      </div>
    )
  }
}

export default Search