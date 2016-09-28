import './style.less'

import React, { Component } from 'react'

import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import ActionAndroid from 'material-ui/svg-icons/action/android'

class Navigation extends Component {
  render() {
    const array = '0'.repeat(10).split('')
    return (
      <Paper zDepth={1} className="navigation-box">
        <h1 style={{marginBottom: '20px'}}>我的导航</h1>
        {array.map(value => {
          return (
            <FlatButton
              key={Math.random()}
              label="Andriod LINK"
              href="https://www.android.com/"
              secondary={true}
              icon={<img className="website-icon" src="http://c.csdnimg.cn/public/favicon.ico" />}
            />
          )
        })}
        <FlatButton
            key={Math.random()}
            label="Andriod"
            href="https://www.android.com/"
            secondary={true}
            icon={<img className="website-icon" src="http://c.csdnimg.cn/public/favicon.ico" />}
            style={{width: '200px', textAlign: 'left'}}
          />
      </Paper>
    )
  }
}

export default Navigation