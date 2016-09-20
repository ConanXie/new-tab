import './style.less'

import React, { Component } from 'react'

import RaisedButton from 'material-ui/RaisedButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

import searchEngine from './search-engine'

class Search extends Component {
  constructor(props) {
    super(props)
    const { link, name, className } = searchEngine[0]
    this.state = {
      searchLink: link,
      searchName: name,
      searchClass: className
    }
  }
  search = (e) => {
    e.preventDefault()
    const text = this.refs.text.value
    const { searchLink } = this.state
    window.open(searchLink + text, '_blank')
  }
  changeEngine = (engine) => {
    const { name, link, className } = engine
    this.setState({
      searchLink: link,
      searchName: name,
      searchClass: className
    })
  }
  render() {
    const { changeEngine } = this
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
                  onTouchTap={e => changeEngine(value)}
                />
              )
            })}
          </IconMenu>
        </div>
        <div className="search-box">
          <form action="" onSubmit={this.search}>
            <input type="text" ref="text" />
            <RaisedButton
              type="submit"
              className="search-btn"
              label={searchName}
              // onClick={this.search}
            />
          </form>
        </div>
      </div>
    )
  }
}

export default Search