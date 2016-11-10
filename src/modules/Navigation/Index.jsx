import './style.less'

import classNames from 'classnames'
import React, { Component } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as websiteActions from '../../actions/websites'

import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import ActionAndroid from 'material-ui/svg-icons/action/android'
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ContentClear from 'material-ui/svg-icons/content/clear'
import ContentLink from 'material-ui/svg-icons/content/link'
import ActionDome from 'material-ui/svg-icons/action/done'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import Snackbar from 'material-ui/Snackbar'
import {blue500, red500, red300, greenA200} from 'material-ui/styles/colors'

const style = {
  website: {
    width: '172px',
    textAlign: 'left',
    color: '#333'
  },
  dialogContent: {
    width: '400px'
  },
  dialogTitle: {
    paddingBottom: '0'
  },
  textField: {
    width: '352px'
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
      dialog: false,
      snackbarOpen: false,
      snackbarMessage: ''
    }
    this.checkLink = /^http(s)?:\/\/\S+$/
    // console.log(props)
  }
  
  checkClick = (e) => {
    if (this.state.edit) {
      e.preventDefault()
    }
  }
  openDialog = () => {
    this.setState({
      dialog: true
    })
  }
  handleClose = () => {
    this.setState({
      dialog: false,
      name: '',
      link: '',
      icon: ''
    })
  }
  handleConfirm = () => {
    const { name, link, icon, edit, index } = this.state
    const { addWebsite, editWebsite } = this.props
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
    // add or edit
    if (!edit) {
      addWebsite(name, link, icon)
    } else {
      // console.log(this.state)
      editWebsite(index, name, link, icon)
    }
    this.handleClose()
  }
  /**
   * watch input
   */
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
  /**
   * toggle edit
   */
  startEdit = () => {
    this.setState({
      edit: true
    })
  }
  finishedEdit = () => {
    this.setState({
      edit: false
    })
  }
  /**
   * delete and edit
   */
  handleDelete = (index) => {
    const { deleteWebsite } = this.props
    // Update view
    this.setState({
      delete: true
    })
    deleteWebsite(index)
  }
  handleEdit = (index, name, link, icon) => {
    this.setState({
      index,
      name,
      link,
      icon
    })
    this.openDialog()
  }
  render() {
    // const array = '0'.repeat(10).split('')
    const { store } = this.props
    const { edit, dialog, snackbarOpen, snackbarMessage, name, link, icon} = this.state
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
            <div className={classNames('tool-box', { 'show-edit': edit })}>
              <div className="first-column">
                <IconButton onTouchTap={this.openDialog}>
                  <ContentAdd />
                </IconButton>
                <IconButton onTouchTap={this.startEdit}>
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
            title={edit ? '编辑网站' : '新增网站'}
            actions={actions}
            modal={false}
            open={dialog}
            onRequestClose={this.handleClose}
            contentStyle={style.dialogContent}
            titleStyle={style.dialogTitle}
          >
            <TextField
              floatingLabelText="名称"
              defaultValue={name}
              style={style.textField}
              onChange={this.nameChange}
            /><br/>
            <TextField
              floatingLabelText="网址"
              defaultValue={link}
              style={style.textField}
              onChange={this.linkChange}
            />
            <TextField
              floatingLabelText="图标地址"
              defaultValue={icon}
              style={style.textField}
              onChange={this.iconChange}
            />
          </Dialog>
        </div>
        <div className="website-area">
          {store.map((value, index) => {
            const { name, link, icon } = value
            let NavIcon
            if (value.icon && this.checkLink.test(icon)) {
              NavIcon = <img className="nav-icon" src={icon} alt={name} />
            } else {
              NavIcon = <ContentLink />
            }
            return (
              <div className="website-box" key={index}>
                <FlatButton
                  label={name}
                  href={link}
                  target="_blank"
                  secondary={true}
                  icon={NavIcon}
                  className="website-link"
                  style={style.website}
                  onClick={this.checkClick}
                />
                <span className={classNames('handle-btn edit-btn', { 'show': edit })} onTouchTap={e => {this.handleEdit(index, name, link, icon)}}>
                  <ModeEdit
                    color={red500}
                    hoverColor={red300}
                    style={style.icon}
                  />
                </span>
                <span className={classNames('handle-btn delete-btn', { 'show': edit })} onTouchTap={e => {this.handleDelete(index)}}>
                  <ContentClear
                    color={red500}
                    hoverColor={red300}
                    style={style.icon}
                  />
                </span>
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
          open={snackbarOpen}
          message={snackbarMessage}
          autoHideDuration={2000}
          onRequestClose={this.closeSnackerbar}
          bodyStyle={style.snackbar}
        />
      </Paper>
    )
  }
}

const mapStateToProps = state => {
  const { store } = state.websites
  return { store }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(websiteActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)