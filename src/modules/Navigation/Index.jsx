import './style.less'

import React, { Component } from 'react'

import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import ActionAndroid from 'material-ui/svg-icons/action/android'
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'

const style = {
  website: {
    width: '172px',
    marginBottom: '10px',
    textAlign: 'left',
    color: '#333'
  },
  dialogContent: {
    width: '348px'
  },
  textField: {
    width: '300px'
  }
}

class Navigation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
  }
  openAddDialog = () => {
    this.setState({
      open: true
    })
  }
  handleClose = () => {
    this.setState({
      open: false,
      name: '',
      link: ''
    })
  }
  handleConfirm = () => {
    console.log(this.state)
  }
  nameChange = (e) => {
    this.setState({
      name: e.target.value
    })
  }
  linkChange = (e) => {
    this.setState({
      link: e.target.value
    })
  }
  render() {
    const array = '0'.repeat(10).split('')
    const actions = [
      <FlatButton
        label="取消"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="确认"
        primary={true}
        onTouchTap={this.handleConfirm}
      />
    ]
    return (
      <Paper zDepth={1} className="navigation-box">
        <div className="tool-bar">
          <h3 className="title">我的导航</h3>
          <div className="tool-area">
            <IconButton onTouchTap={this.openAddDialog}>
              <ContentAdd />
            </IconButton>
            <IconButton>
              <ModeEdit />
            </IconButton>
          </div>
          <Dialog
            title="新增网站"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
            contentStyle={style.dialogContent}
          >
            <TextField
              floatingLabelText="名称"
              style={style.textField}
              onChange={this.nameChange}
            /><br/>
            <TextField
              floatingLabelText="网址"
              style={style.textField}
              onChange={this.linkChange}
            />
          </Dialog>
        </div>
        <div className="website-area">
          {array.map(value => {
            return (
              <FlatButton
                key={Math.random()}
                label="Google"
                href="https://www.google.com/"
                target="_blank"
                secondary={true}
                icon={<img className="website-icon" src="https://www.google.com/images/branding/product/ico/googleg_lodp.ico" />}
                className="website-link"
                style={style.website}
              />
            )
          })}
          {/*<FlatButton
            key={Math.random()}
            label="Andriod"
            href="https://www.android.com/"
            secondary={true}
            icon={<ActionAndroid style={{ width: 18, height: 18 }} />}
            className="website-link"
            style={style.website}
          />*/}
        </div>
      </Paper>
    )
  }
}

export default Navigation