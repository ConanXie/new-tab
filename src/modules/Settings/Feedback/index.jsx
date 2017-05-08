import './style.less'

import React, { Component } from 'react'

import muiThemeable from 'material-ui/styles/muiThemeable'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import Snackbar from 'material-ui/Snackbar'

const style = {
  dialogContent: {
    width: '380px'
  },
  dialogTitle: {
    paddingBottom: '0'
  },
  textField: {
    width: '332px'
  },
  snackbar: {
    maxWidth: '150px'
  }
}

class Feedback extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dialogOpen: false,
      snackbarOpen: false,
      snackbarMessage: ''
    }
    this.emailPattern = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/
    // this.feedbackUrl = 'http://localhost:5300/api/feedback'
    this.feedbackUrl = 'https://tab.xiejie.co/api/feedback'
    this.loading = false
  }
  openDialog = () => {
    this.setState({
      dialogOpen: true
    })
  }
  hideDialog = () => {
    this.setState({
      dialogOpen: false,
      email: '',
      content: ''
    })
  }
  closeSnackerbar = () => {
    this.setState({
      snackbarOpen: false
    })
  }
  /**
   * watch email and content
   */
  emailChange = (e, nv) => {
    this.setState({
      email: nv
    })
  }
  contentChange = (e, nv) => {
    this.setState({
      content: nv
    })
  }
  /**
   * submit feedback
   */
  handleSubmit = () => {
    // prevent multipul submit
    if (this.loading) return

    const { email, content } = this.state
    if (!this.emailPattern.test(email)) {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: '电子邮件格式不正确🙂'
      })
      return
    }
    if (!content) {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: '说点什么吧🙂'
      })
      return
    }
    this.loading = true
    fetch(this.feedbackUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `email=${email}&content=${content}`
    }).then(res => {
      if (res.ok) {
        res.json().then(data => {
          this.setState({
            snackbarOpen: true,
            snackbarMessage: data.code ? data.msg : '反馈成功，十分感谢'
          })
          setTimeout(() => {
            this.loading = false
            this.hideDialog()
          }, 500)
        })
      }
    })
  }
  render() {
    const { dialogOpen, snackbarOpen, snackbarMessage } = this.state
    const { muiTheme } = this.props
    const actions = [
      <FlatButton
        label="取消"
        primary={true}
        onTouchTap={this.hideDialog}
      />,
      <FlatButton
        label="确认"
        primary={true}
        onTouchTap={this.handleSubmit}
      />
    ]
    return (
      <div className="feedback">
        <FlatButton label="反馈" onTouchTap={this.openDialog} />
        <Dialog
          title="反馈"
          actions={actions}
          modal={false}
          open={dialogOpen}
          onRequestClose={this.hideDialog}
          contentStyle={style.dialogContent}
          titleStyle={style.dialogTitle}
        >
          <TextField
            floatingLabelText="你的电子邮件地址"
            style={style.textField}
            onChange={this.emailChange}
          /><br />
          <TextField
            multiLine={true}
            floatingLabelText="有什么想对我说的"
            rows={2}
            rowsMax={4}
            style={style.textField}
            onChange={this.contentChange}
          />
        </Dialog>
        <Snackbar
          open={snackbarOpen}
          message={snackbarMessage}
          autoHideDuration={2000}
          onRequestClose={this.closeSnackerbar}
          bodyStyle={style.snackbar}
        />
      </div>
    )
  }
}

export default muiThemeable()(Feedback)