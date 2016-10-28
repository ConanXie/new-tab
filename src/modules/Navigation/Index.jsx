import './style.less'

import React, { Component } from 'react'

import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import ActionAndroid from 'material-ui/svg-icons/action/android'
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ContentClear from 'material-ui/svg-icons/content/clear'
import ActionDome from 'material-ui/svg-icons/action/done'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import Snackbar from 'material-ui/Snackbar'
import {blue500, red500, red900, greenA200} from 'material-ui/styles/colors'

const style = {
  website: {
    width: '172px',
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
  },
  toolArea: {
    transform: ''
  },
  span: {
    display: 'none',
    width: '18px',
    height: '18px'
  },
  icon: {
    width: '18px',
    height: '18px'
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
      link: '',
      icon: ''
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
  iconChange = (e) => {
    this.setState({
      icon: e.target.value
    })
  }
  closeSnackerbar = () => {
    this.setState({
      snackbarOpen: false
    })
  }
  onEdit = () => {
    this.setState({
      edit: true
    })
    style.toolArea.transform = 'translateY(-48px)'
    style.span.display = ''
    console.log(this.state)
  }
  finishedEdit = () => {
    this.setState({
      edit: false
    })
    style.toolArea.transform = ''
    style.span.display = 'none'
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
            <div className="tool-box" style={style.toolArea}>
              <div className="first-column">
                <IconButton onTouchTap={this.openAddDialog}>
                  <ContentAdd />
                </IconButton>
                <IconButton onTouchTap={this.onEdit}>
                  <ModeEdit />
                </IconButton>
              </div>
              <div className="second-column">
                <IconButton onTouchTap={this.finishedEdit}>
                  <ActionDome />
                </IconButton>
              </div>
            </div>
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
            <TextField
              floatingLabelText="图标地址"
              style={style.textField}
              onChange={this.iconChange}
            />
          </Dialog>
        </div>
        <div className="website-area">
          {array.map((value, index) => {
            return (
              <div className="website-box" key={index}>
                <FlatButton
                  label="Google"
                  href="https://www.google.com/"
                  target="_blank"
                  secondary={true}
                  icon={<img className="website-icon" src="https://www.google.com/images/branding/product/ico/googleg_lodp.ico" />}
                  className="website-link"
                  style={style.website}
                />
                <span className="delete-btn" style={style.span}>
                  <ContentClear
                    color={red500}
                    hoverColor={red900}
                    style={style.icon}
                  />
                </span>
                {/*<span className="delete-btn" style={style.span}></span>*/}
              </div>
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