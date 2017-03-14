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
    color: '#333',
    transition: 'background-color 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
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
    transition: 'fill 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
  },
  deleteHandleIcon: {
    width: 14,
    height: 14,
    marginTop: 2,
    transition: 'fill 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
  },
  floatingActionButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
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
      snackbarMessage: '',
      edit: true
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
  beginGrab = e => {
    if (this.state.edit) {
      const ele = e.currentTarget
      const area = this.refs.area
      const origin = Array.prototype.indexOf.call(area.childNodes, ele)
      const areaHeight = Math.ceil(area.childNodes.length / 5) * 36 + (Math.ceil(area.childNodes.length / 5) - 1) * 15
      // mouse down coordinate
      const downScreenX = e.screenX
      const downScreenY = e.screenY
      let clone
      let state = 1
      const mouseMove = e => {
        const moveScreenX = e.screenX
        const moveScreenY = e.screenY
        const clientToScreenX = moveScreenX - e.clientX
        const clientToScreenY = moveScreenY - e.clientY
        // when the clone element not be cloned, mouse down and move
        if (!clone && (downScreenX !== moveScreenX || downScreenY !== moveScreenY)) {
          // remove 'mousemove' listener on ele
          ele.removeEventListener('mousemove', mouseMove, false)
          
          console.log('grab begin')

          clone = ele.cloneNode(true)
          ele.setAttribute('aria-grabbed', "true")
          clone.classList.add('grabbing')
          clone.style.transform = ''
          clone.style.position = 'absolute'

          const offsetX = e.offsetX
          const offsetY = e.offsetY
          clone.style.left = moveScreenX - clientToScreenX - offsetX + 'px'
          clone.style.top = moveScreenY - clientToScreenY - offsetY + 'px'
          /**
           * move mouse on screen
           * @param {Event Object} e 
           */
          const moveClone = e => {
            e.preventDefault()

            clone.style.left = e.screenX - clientToScreenX - offsetX + 'px'
            clone.style.top = e.screenY - clientToScreenY - offsetY + 'px'

            const relativeX = e.screenX - clientToScreenX - area.offsetLeft
            const relativeY = e.screenY - clientToScreenY - area.offsetTop

            // when mouse out of the area
            if ((relativeX < 0 || relativeX > 900) || (relativeY < 0 || relativeY > areaHeight)) {
              // from in to out
              if (state) {
                const origin = Array.prototype.indexOf.call(area.childNodes, ele)
                area.removeChild(ele)
                this.setWebsitesPostion(origin)
                state = 0
              }
              return
            }
            // when mouse in the area
            if ((relativeX >= 0 && relativeX <= 900) && (relativeY >= 0 && relativeY <= areaHeight)) {
              // from out to in
              if (!state) {
                const posX = (relativeX - 15) % 180
                const posY = relativeY % 51
                if (posX <= 150 && posY <= 36) {
                  const countX = Math.floor((relativeX - 15) / 180)
                  const countY = Math.floor(relativeY / 51)
                  const landing = countX + 5 * countY
                  area.insertBefore(ele, area.childNodes[landing])
                  this.setWebsitesPostion(landing + 1)
                  state = 1
                }
                return
              }
            }
            // console.log('in')
            const posX = (relativeX - 15) % 180
            const posY = relativeY % 51
            if (posX <= 150 && posY <= 36) {
              const countX = Math.floor((relativeX - 15) / 180)
              const countY = Math.floor(relativeY / 51)
              const landing = countX + 5 * countY
              if (landing >= 0 && landing < area.childNodes.length) {
                const origin = Array.prototype.indexOf.call(area.childNodes, ele)
                // console.log(origin)
                if (landing < origin) {
                  area.insertBefore(ele, area.childNodes[landing])
                  this.setWebsitesPostion(landing, origin)
                } else {
                  area.insertBefore(ele, area.childNodes[landing + 1])
                  this.setWebsitesPostion(origin, landing)
                }
              } else if (landing < 5 * (countY + 1)) {
                area.appendChild(ele)
                this.setWebsitesPostion(origin)
              }
            }
          }
          document.addEventListener('mousemove', moveClone, false)
          /**
           * calc position when mouseup
           * @param {Event Object} e 
           */
          const mouseUp = e => {
            document.removeEventListener('mousemove', moveClone, false)
            // console.log(e)
            // const area = this.refs.area
            /*const relativeX = e.screenX - clientToScreenX - area.offsetLeft
            const relativeY = e.screenY - clientToScreenY - area.offsetTop
            console.log(relativeX, relativeY)
            const posX = (relativeX - 15) % 180
            const posY = relativeY % 51
            if (posX <= 150 && posY <= 36) {
              const countX = Math.floor((relativeX - 15) / 180)
              const countY = Math.floor(relativeY / 51)
              const landing = countX + 5 * countY
              console.log('landing', landing)
              if (landing >= 0 && landing < area.childNodes.length) {
                const origin = Array.prototype.indexOf.call(area.childNodes, ele)
                console.log('origin', origin)
                if (landing < origin) {
                  area.insertBefore(ele, area.childNodes[landing])
                  this.setWebsitesPostion(landing, origin)
                } else {
                  area.insertBefore(ele, area.childNodes[landing + 1])
                  this.setWebsitesPostion(origin, landing)
                }
              } else {
                area.insertBefore(ele, area.childNodes[origin])
                this.setWebsitesPostion(origin, area.childNodes.length - 1)
              }
            } else {
              area.insertBefore(ele, area.childNodes[origin])
              this.setWebsitesPostion(origin, area.childNodes.length - 1)
            }*/
            if (area.childNodes.length !== this.props.store.length) {
              area.insertBefore(ele, area.childNodes[origin])
              this.setWebsitesPostion(origin, area.childNodes.length - 1)
            }
            ele.setAttribute('aria-grabbed', "false")
            document.body.removeChild(clone)
            document.removeEventListener('mouseup', mouseUp, false)
          }
          document.addEventListener('mouseup', mouseUp, false)

          clone.querySelector('a').style.cursor = '-webkit-grabbing'
          document.body.appendChild(clone)
        }
      }
      ele.addEventListener('mousemove', mouseMove, false)
    }
  }
  setWebsitesPostion = (start, end = this.refs.area.childNodes.length - 1) => {
    const area = this.refs.area
    for (let i = start; i <= end; i++) {
      area.childNodes[i].style.transform = `translate(${15 + (i%5)*150 + 30*(i%5)}px, ${Math.floor(i/5)*15 + Math.floor(i/5)*36}px)`
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
        <div className={classNames('website-area', { 'empty': !store.length })} ref="area">
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
              <div
                className={classNames('website-box', { 'grabable': edit })}
                aria-grabbed="false"
                id={`website:${index}`}
                key={index}
                style={{ transform: `translate(${15 + (index%5)*150 + 30*(index%5)}px, ${Math.floor(index/5)*15 + Math.floor(index/5)*36}px)` }}
                onMouseDown={this.beginGrab}
              >
                <FlatButton
                  label={name}
                  href={link}
                  target={target}
                  secondary={true}
                  icon={<img className="favicon" src={`https://www.google.com/s2/favicons?domain=${link.replace(/http(s)?:\/\//, '')}`} alt={name} />}
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
        <div className={classNames('float-actions', { 'hide': !store.length })} onMouseLeave={this.hideEditBtn}>
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