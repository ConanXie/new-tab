import './style.less'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import muiThemeable from 'material-ui/styles/muiThemeable'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import Snackbar from 'material-ui/Snackbar'
import CircularProgress from 'material-ui/CircularProgress'

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
  },
  loading: {
    position: 'relative',
    top: '6px',
    height: '24px',
    minWidth: '88px',
    textAlign: 'center'
  }
}

class Feedback extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      content: '',
      dialogOpen: false,
      snackbarOpen: false,
      snackbarMessage: '',
      loading: false
    }
    this.emailPattern = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/
    // this.feedbackUrl = 'http://localhost:5300/api/feedback'
    this.feedbackUrl = 'https://tab.xiejie.app/api/feedback'
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
    const { email, content, loading } = this.state

    // prevent multipul submit
    if (loading) return
    
    if (email && !this.emailPattern.test(email)) {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: chrome.i18n.getMessage('feedback_email_error')
      })
      return
    }
    if (!content) {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: chrome.i18n.getMessage('feedback_message_error')
      })
      return
    }
    this.setState({
      loading: true
    })
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
            snackbarMessage: data.code ? data.msg : chrome.i18n.getMessage('feedback_success')
          })
          this.setState({
            loading: false
          })
          setTimeout(() => {
            this.hideDialog()
          }, 1500)
        })
      }
    })
  }
  render() {
    const { dialogOpen, snackbarOpen, snackbarMessage, loading } = this.state
    const { muiTheme } = this.props

    const Loading = <CircularProgress style={style.loading} size={24} thickness={2} />
    const Confirm = (
      <FlatButton
        label={chrome.i18n.getMessage('button_confirm')}
        primary={true}
        onClick={this.handleSubmit}
      />
    )

    const actions = [
      <FlatButton
        label={chrome.i18n.getMessage('button_cancel')}
        primary={true}
        onClick={this.hideDialog}
      />,
      loading ? Loading : Confirm
    ]

    return (
      <div>
        <FlatButton
          className="feedback"
          label={chrome.i18n.getMessage('settings_feedback')}
          onClick={this.openDialog}
        />
        <Dialog
          title={chrome.i18n.getMessage('settings_feedback')}
          actions={actions}
          modal={false}
          open={dialogOpen}
          onRequestClose={this.hideDialog}
          contentStyle={style.dialogContent}
          titleStyle={style.dialogTitle}
        >
          <TextField
            floatingLabelText={chrome.i18n.getMessage('feedback_email_placeholder')}
            style={style.textField}
            onChange={this.emailChange}
          /><br />
          <TextField
            multiLine={true}
            floatingLabelText={chrome.i18n.getMessage('feedback_message_placeholder')}
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
        />
      </div>
    )
  }
}

export default muiThemeable()(Feedback)
