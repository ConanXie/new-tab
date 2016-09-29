import './style.less'

import React, { Component } from 'react'

import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import ActionAndroid from 'material-ui/svg-icons/action/android'
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import ContentAdd from 'material-ui/svg-icons/content/add'

const style = {
  website: {
    width: '172px',
    marginBottom: '10px',
    textAlign: 'left',
    color: '#333'
  }
}

class Navigation extends Component {
  render() {
    const array = '0'.repeat(10).split('')
    return (
      <Paper zDepth={1} className="navigation-box">
        <div className="tool-bar">
          <h3 className="title">我的导航</h3>
          <div className="tool-area">
            <IconButton>
              <ContentAdd />
            </IconButton>
            <IconButton>
              <ModeEdit />
            </IconButton>
          </div>
        </div>
        {array.map(value => {
          return (
            <FlatButton
              key={Math.random()}
              label="Google"
              href="https://www.google.com/"
              secondary={true}
              icon={<img className="website-icon" src="https://www.google.com/images/branding/product/ico/googleg_lodp.ico" />}
              className="website-link"
              style={style.website}
            />
          )
        })}
        <FlatButton
            key={Math.random()}
            label="Andriod"
            href="https://www.android.com/"
            secondary={true}
            icon={<ActionAndroid style={{ width: 18, height: 18 }} />}
            className="website-link"
            style={style.website}
          />
      </Paper>
    )
  }
}

export default Navigation