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
import Snackbar from 'material-ui/Snackbar'

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
  dialogTitle: {
    paddingBottom: '0'
  },
  textField: {
    width: '300px'
  },
  snackbar: {
    maxWidth: '150px',
    // borderRadius: '0',
    // textAlign: 'center'
  }
}

class Navigation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addDialog: false,
      snackbarOpen: false,
      snackbarMessage: ''
    }
    this.checkLink = /^http(s)?:\/\/\S+$/
  }
  openAddDialog = () => {
    this.setState({
      addDialog: true
    })
  }
  handleClose = () => {
    this.setState({
      addDialog: false,
      name: '',
      link: ''
    })
  }
  handleConfirm = () => {
    const { name, link } = this.state
    if (!name) {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: '网站名称尚未输入'
      })
      return
    }
    if (!this.checkLink.test(link)) {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: '网址格式不正确'
      })
      return
    }
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
  closeSnackerbar = () => {
    this.setState({
      snackbarOpen: false
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
            open={this.state.addDialog}
            onRequestClose={this.handleClose}
            contentStyle={style.dialogContent}
            titleStyle={style.dialogTitle}
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
        <Snackbar
          open={this.state.snackbarOpen}
          message={this.state.snackbarMessage}
          autoHideDuration={2000}
          onRequestClose={this.closeSnackerbar}
          bodyStyle={style.snackbar}
        />
      </Paper>
    )
  }
}

export default Navigation