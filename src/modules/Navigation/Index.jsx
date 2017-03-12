import './style.less'

import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as websiteActions from '../../actions/websites'

import { FormattedMessage } from 'react-intl'

import Paper from 'material-ui/Paper'
import Checkbox from 'material-ui/Checkbox'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import ActionAndroid from 'material-ui/svg-icons/action/android'
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ContentClear from 'material-ui/svg-icons/content/clear'
import ContentLink from 'material-ui/svg-icons/content/link'
import ActionDone from 'material-ui/svg-icons/action/done'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import Snackbar from 'material-ui/Snackbar'
import {blue500, red500, red300, grey600, grey500, greenA200} from 'material-ui/styles/colors'

const style = {
  website: {
    width: '150px',
    textAlign: 'left',
    color: '#333'
  },
  dialogContent: {
    width: '380px'
  },
  dialogTitle: {
    paddingBottom: '0'
  },
  confirmTitle: {
    paddingBottom: '24px'
  },
  textField: {
    width: '332px'
  },
  snackbar: {
    maxWidth: '150px',
    // borderRadius: '0',
    // textAlign: 'center'
  },
  toolArea: {
    transform: ''
  },
  classifyCheckbox: {
    width: 'auto',
    marginRight: 10,
    marginLeft: 10
  },
  classifyCheckboxLabel: {
    fontSize: 14
  },
  span: {
    display: 'none',
    width: '18px',
    height: '18px'
  },
  editHandleIcon: {
    width: 18,
    height: 18,
  },
  deleteHandleIcon: {
    width: 14,
    height: 14,
    marginTop: 2
  },
  floatingActionButton: {
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  editActionButton: {
    position: 'absolute',
    top: 0,
    left: 8,
  }
}

class Navigation extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      confirm: false,
      dialog: false,
      snackbarOpen: false,
      snackbarMessage: ''
    }
    // this.checkLink = /^http(s)?:\/\/\S+$/
    // console.log(props)
  }
  
  checkClick = (e) => {
    if (this.state.edit) {
      e.preventDefault()
    }
  }
  openConfirm = () => {
    this.setState({
      confirm: true
    })
  }
  hideConfirm = () => {
    this.setState({
      confirm: false
    })
  }
  handleConfirm = () => {
    const { deleteWebsite, store } = this.props
    deleteWebsite(this.state.index)
    this.hideConfirm()

    // when store clear, restore the edit status
    if (!store.length) {
      this.finishedEdit()
    }
  }
  openDialog = () => {
    this.setState({
      dialog: true
    })
  }
  hideDialog = () => {
    this.setState({
      dialog: false,
      name: '',
      link: ''
    })
  }
  handleSubmit = () => {
    const { name, link, edit, index } = this.state
    const { addWebsite, editWebsite } = this.props
    const { intl } = this.context
    if (!name) {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: intl.formatMessage({ id: 'nav.edit.input.forget.name' })
      })
      return
    }
    if (!link) {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: intl.formatMessage({ id: 'nav.edit.input.forget.URL' })
      })
      return
    }
    /*if (!this.checkLink.test(link)) {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: '请在网址前加上 http:// 或者 https://'
      })
      return
    }*/
    // judge add or edit
    if (!edit) {
      addWebsite(name, link)
    } else {
      editWebsite(index, name, link)
    }
    this.hideDialog()
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
  closeSnackerbar = () => {
    this.setState({
      snackbarOpen: false
    })
  }
  /**
   * toggle edit
   */
  startEdit = () => {
    this.hideEditBtn()
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
    this.openConfirm()
    // Record the index
    this.setState({
      index
    })
  }
  handleEdit = (index, name, link) => {
    this.setState({
      index,
      name,
      link
    })
    this.openDialog()
  }
  showEditBtn = (event) => {
    if (!this.state.edit) {
      this.refs.editFloatBtn.classList.add('show')
    }
  }
  hideEditBtn = (event) => {
    this.refs.editFloatBtn.classList.remove('show')
  }
  handleMainFloatBtn = () => {
    if (!this.state.edit) {
      this.openDialog()
    } else {
      this.finishedEdit()
    }
  }
  render() {
    const { store, target, muiTheme } = this.props
    const { edit, dialog, confirm, snackbarOpen, snackbarMessage, name, link} = this.state
    const { intl } = this.context
    const actions = [
      <FlatButton
        label={intl.formatMessage({ id: 'button.cancel' })}
        primary={true}
        onTouchTap={this.hideDialog}
      />,
      <FlatButton
        label={intl.formatMessage({ id: 'button.confirm' })}
        primary={true}
        onTouchTap={this.handleSubmit}
      />
    ]
    const confirmActions = [
      <FlatButton
        label={intl.formatMessage({ id: 'button.cancel' })}
        primary={true}
        onTouchTap={this.hideConfirm}
      />,
      <FlatButton
        label={intl.formatMessage({ id: 'button.confirm' })}
        primary={true}
        onTouchTap={this.handleConfirm}
      />
    ]
    return (
      <Paper zDepth={0} className="navigation-box">
        <div className="tool-bar">
          {/*<h3 className="title">
            <FormattedMessage id="nav.title" />
          </h3>*/}
          <div className={classNames('tool-area', { 'hide': !edit })}>
            <FlatButton
              label="添加分类"
              icon={<ContentAdd />}
            />
            <Checkbox label="显示分类" style={style.classifyCheckbox} labelStyle={style.classifyCheckboxLabel} />
            {/*<div className={classNames('tool-box', { 'show-edit': edit })}>
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
                  <ActionDone />
                </IconButton>
              </div>
            </div>*/}
          </div>
        </div>
        <div className={classNames('website-area', { 'empty': !store.length })}>
          {!store.length && (
            <div className="empty-box">
              <p className="empty-text">{intl.formatMessage({ id: 'empty.text.navigation' })}</p>
              <RaisedButton
                label={intl.formatMessage({ id: 'empty.text.navigation.add' })}
                primary={true}
                onTouchTap={this.openDialog}
              />
            </div>
          )}
          {store.map((value, index) => {
            const { name, link } = value
            return (
              <div className="website-box" key={index}>
                <FlatButton
                  label={name}
                  href={link}
                  target={target}
                  secondary={true}
                  icon={<img className="nav-icon" src={`https://www.google.com/s2/favicons?domain=${link.replace(/http(s)?:\/\//, '')}`} alt={name} />}
                  className="website-link"
                  style={style.website}
                  onClick={this.checkClick}
                />
                <span className={classNames('handle-btn edit-btn', { 'show': edit })} onTouchTap={e => {this.handleEdit(index, name, link)}}>
                  <ModeEdit
                    color={grey500}
                    hoverColor={grey600}
                    style={style.editHandleIcon}
                  />
                </span>
                <span className={classNames('handle-btn delete-btn', { 'show': edit })} onTouchTap={e => {this.handleDelete(index)}}>
                  <ContentClear
                    color="#fff"
                    style={style.deleteHandleIcon}
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
        <div className="float-actions" onMouseLeave={this.hideEditBtn}>
          <div className='edit-float-btn' ref="editFloatBtn" style={style.editActionButton}>
            <FloatingActionButton
              mini={true}
              onTouchTap={this.startEdit}
            >
              <ModeEdit />
            </FloatingActionButton>
          </div>
          <FloatingActionButton
            style={style.floatingActionButton}
            onTouchTap={this.handleMainFloatBtn}
            onMouseEnter={this.showEditBtn}
          >
            { edit ? <ActionDone /> : <ContentAdd /> }
          </FloatingActionButton>
        </div>
        <Dialog
          title={edit ? intl.formatMessage({ id: 'nav.edit.title.edit' }) : intl.formatMessage({ id: 'nav.edit.title.add' })}
          actions={actions}
          modal={false}
          open={dialog}
          onRequestClose={this.hideDialog}
          contentStyle={style.dialogContent}
          titleStyle={style.dialogTitle}
        >
          <TextField
            floatingLabelText={intl.formatMessage({ id: 'nav.edit.input.website' })}
            defaultValue={name}
            style={style.textField}
            onChange={this.nameChange}
            underlineFocusStyle={{ color: muiTheme.palette.primary1Color }}
          /><br/>
          <TextField
            floatingLabelText={intl.formatMessage({ id: 'nav.edit.input.URL' })}
            defaultValue={link}
            style={style.textField}
            onChange={this.linkChange}
            underlineFocusStyle={{ color: muiTheme.palette.primary1Color }}
          />
        </Dialog>
        <Dialog
          title={intl.formatMessage({ id: 'nav.delete.title' })}
          actions={confirmActions}
          modal={false}
          open={confirm}
          onRequestClose={this.hideConfirm}
          contentStyle={style.dialogContent}
          titleStyle={style.confirmTitle}
        >
          {intl.formatMessage({ id: 'nav.delete.tip' })}
        </Dialog>
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