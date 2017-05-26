import './style.less'

import classNames from 'classnames'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as websitesActions from '../../actions/websites'
import * as settingsActions from '../../actions/settings'

import { FormattedMessage } from 'react-intl'

import muiThemeable from 'material-ui/styles/muiThemeable'
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
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import Snackbar from 'material-ui/Snackbar'
import {blue500, red500, red300, grey600, grey500, greenA200} from 'material-ui/styles/colors'

import { classificationMax, websiteMax } from '../../configs'

const style = {
  website: {
    width: '150px',
    textAlign: 'left',
    // color: '#333',
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
  },
  classficationInput: {
    height: 36,
    fontSize: 14
  },
  classficationHintText: {
    bottom: 8
  }
}

class Navigation extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.props.initialData()
    this.state = {
      confirm: false,
      dialog: false,
      classifyDialog: false,
      snackbarOpen: false,
      snackbarMessage: '',
      deleteOpen: false,
      deleteMessage: '',
      edit: false,
      isClassified: props.settings.isClassified,
      cIndex: props.classifiedStore.length - 1
    }
    // this.checkLink = /^http(s)?:\/\/\S+$/
    // console.log(props)

    // some variables
    this.websiteWidth = 150
    this.websiteHeight = 36
    this.margin = 15
    this.row = 5
    this.wrapperWidth = 900
    this.spacingX = 30
    this.spacingY = 15

    // storage
    this.cache = {}
  }
  checkClick = (e) => {
    if (this.state.edit) {
      e.preventDefault()
    }
  }
  closeDelete = () => {
    this.setState({
      deleteOpen: false
    })
  }
  handleConfirm = () => {
    const { deleteWebsite, store } = this.props
    const { index, cIndex } = this.cache
    deleteWebsite(index, cIndex)
    this.hideConfirm()

    // when store clear, restore the edit status
    if (!store.length) {
      this.finishedEdit()
    }
  }
  openDialog = () => {
    this.setState({
      dialog: true,
      cIndex: this.props.classifiedStore.length - 1
    })
  }
  hideDialog = () => {
    this.setState({
      dialog: false,
      name: '',
      link: ''
    })
    // clear cache
    this.cache.index = ''
    this.cache.name = ''
    this.cache.link = ''
    this.cache.cIndex = ''
  }
  handleSubmit = () => {
    const { edit } = this.state
    const { name, link, index, cIndex } = this.cache
    const { addWebsite, editWebsite, store } = this.props
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
      if (store.length < websiteMax) {
        addWebsite(name, link, this.state.cIndex)
      } else {
        this.setState({
          snackbarOpen: true,
          snackbarMessage: intl.formatMessage({ id: 'nav.websites.max.tip' }) + websiteMax
        })
        return
      }
    } else {
      editWebsite(index, name, link, cIndex)
    }
    this.hideDialog()
  }
  /**
   * watch input
   */
  nameChange = (e) => {
    /*this.setState({
      name: e.target.value
    })*/
    this.cache.name = e.target.value
  }
  linkChange = (e) => {
    /*this.setState({
      link: e.target.value
    })*/
    this.cache.link = e.target.value
  }
  classifyChange = (e, key) => {
    // console.log(key)
    this.setState({
      cIndex: key
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
  isClassified = (event, bool) => {
    // console.log(bool)
    this.setState({
      isClassified: bool
    })
    this.props.saveSettings({ isClassified: bool })
    /*if (bool) {
      this.wrapperWidth = 820
      this.spacingX = 10
    } else {
      this.wrapperWidth = 900
      this.spacingX = 30
    }*/
  }
  openClassifyDialog = () => {
    this.setState({
      classifyDialog: true
    })
  }
  hideClassifyDialog = () => {
    this.setState({
      classifyDialog: false
    })
  }
  addClassify = () => {
    const { addEmptyClassification } = this.props
    const name = this.refs.classificationName.input.value

    if (name && name !== 'unclassified') {
      addEmptyClassification(name)
    }
    
    this.hideClassifyDialog()
  }
  deleteClassification = (index) => {
    const { deleteClassification } = this.props
    deleteClassification(index)
    this.setState({
      r: Math.random()
    })
  }
  /**
   * delete and edit
   */
  handleDelete = (name, index, cIndex) => {
    // this.openDeleteMessage()
    const { deleteWebsite, store } = this.props
    const { intl } = this.context
    this.setState({
      deleteOpen: true,
      deleteMessage: `${intl.formatMessage({ id: 'nav.delete.status' })} ${name}`
    })
    // Record the info
    this.cache.index = index
    this.cache.cIndex = cIndex
    deleteWebsite(index, cIndex)
    // when store clear, restore the edit status
    if (!store.length) {
      this.finishedEdit()
    }
    /*this.setState({
      index
    })*/
  }
  undoDelete = () => {
    const { undoDeletedWebsite } = this.props
    undoDeletedWebsite()
    this.closeDelete()
    // console.log(this.cache)
  }
  handleEdit = (index, name, link, cIndex) => {
    this.cache.index = index
    this.cache.name = name
    this.cache.link = link
    this.cache.cIndex = cIndex

    this.setState({
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
    if (this.state.edit && e.target.nodeName === 'SPAN') {
      const ele = e.currentTarget
      // const area = this.refs.area
      let area = ele.parentNode
      let originArea = area
      const wrap = area.parentNode.parentNode
      let cacheArea
      let total = area.childNodes.length
      let origin = Array.prototype.indexOf.call(area.childNodes, ele)
      // const areaHeight = Math.ceil(area.childNodes.length / 5) * 36 + (Math.ceil(area.childNodes.length / 5) - 1) * 15
      let areaHeight = Math.ceil(area.childNodes.length / this.row) * (this.websiteHeight + this.spacingY) - this.spacingY + this.margin*2
      // console.log(areaHeight)
      // mouse down coordinate
      const downScreenX = e.screenX
      const downScreenY = e.screenY
      let clone
      let state = 1
      const mouseMove = e => {
        // console.log(e)
        const scrollTop = document.querySelector('#app').scrollTop
        const scrollLeft = document.querySelector('#app').scrollLeft
        const moveScreenX = e.screenX
        const moveScreenY = e.screenY
        const clientToScreenX = moveScreenX - e.clientX
        const clientToScreenY = moveScreenY - e.clientY
        // when the clone element not be cloned, mouse down and move
        if (!clone && (downScreenX !== moveScreenX || downScreenY !== moveScreenY)) {
          // remove 'mousemove' listener on ele
          ele.removeEventListener('mousemove', mouseMove, false)
          
          // console.log('grab begin')

          clone = ele.cloneNode(true)
          ele.setAttribute('aria-grabbed', "true")
          clone.classList.add('grabbing')
          clone.style.transform = ''
          clone.style.position = 'absolute'

          const offsetX = e.offsetX
          const offsetY = e.offsetY
          clone.style.left = moveScreenX - clientToScreenX - scrollLeft - offsetX + 'px'
          clone.style.top = moveScreenY - clientToScreenY - scrollTop - offsetY + 'px'
          /**
           * move mouse on screen
           * @param {Event Object} e 
           */
          const moveClone = e => {
            e.preventDefault()
            const scrollTop = document.querySelector('#app').scrollTop

            if (this.state.isClassified && Array.prototype.indexOf.call(area.childNodes, ele) !== -1) {
              total = area.childNodes.length
              // origin = Array.prototype.indexOf.call(area.childNodes, ele)
            }
            areaHeight = Math.ceil(area.childNodes.length / this.row) * (this.websiteHeight + this.spacingY) - this.spacingY + this.margin*2
            // console.log('areaHeight', areaHeight)
            clone.style.left = e.screenX - clientToScreenX - offsetX + 'px'
            clone.style.top = e.screenY - clientToScreenY - offsetY + 'px'

            // console.log('clinetX, clinetY', clientToScreenX, clientToScreenY)
            let relativeX = e.screenX - clientToScreenX - area.offsetLeft + scrollLeft
            let relativeY = e.screenY - clientToScreenY - area.offsetTop + scrollTop
            // console.log('relativeX, relativeY', relativeX, relativeY)
            
            // when mouse out of the area
            if ((relativeX < 0 || relativeX > this.wrapperWidth) || (relativeY < 0 || relativeY > areaHeight)) {
              // from in to out
              if (state) {
                // console.log('from in to out')
                const origin = Array.prototype.indexOf.call(area.childNodes, ele)
                // console.log(origin)
                area.removeChild(ele)
                this.setWebsitesPostion(area, origin)
                state = 0
              }
              if (!this.state.isClassified) {
                return
              }
            }
            // when mouse in the area
            if ((relativeX >= 0 && relativeX <= this.wrapperWidth) && (relativeY >= 0 && relativeY <= areaHeight)) {
              // from out to in
              if (!state) {
                // console.log('from out to in')
                const posX = (relativeX - this.margin) % (this.websiteWidth + this.spacingX)
                const posY = (relativeY - this.margin) % (this.websiteHeight + this.spacingY)
                if ((posX >= 0 && posX <= this.websiteWidth) && (posY >= 0 && posY <= this.websiteHeight)) {
                  const countX = Math.floor((relativeX - this.margin) / (this.websiteWidth + this.spacingX))
                  const countY = Math.floor((relativeY - this.margin) / (this.websiteHeight + this.spacingY))
                  const landing = countX + this.row * countY
                  // console.log('insert')
                  area.insertBefore(ele, area.childNodes[landing])
                  this.setWebsitesPostion(area, landing + 1)
                  state = 1
                }
                if (!this.state.isClassified) {
                  return
                }
              }
            }
            // console.log('in')
            const posX = (relativeX - this.margin) % (this.websiteWidth + this.spacingX)
            let posY
            if (relativeY >= 0) {
              posY = (relativeY) % (this.websiteHeight + this.spacingY)
            } else if (relativeY < 0 && relativeY > -this.margin) {
              posY = (-relativeY) % (this.websiteHeight + this.spacingY)
            }
            // console.log('posX %s, posY %s', posX, posY)
            if ((posX > 0 && posX < this.websiteWidth) && (posY > 0 && posY < this.websiteHeight)) {
              const countX = Math.floor((relativeX - this.margin) / (this.websiteWidth + this.spacingX))
              const countY = Math.floor((relativeY) / (this.websiteHeight + this.spacingY))
              const landing = countX + this.row * countY
              const origin = Array.prototype.indexOf.call(area.childNodes, ele)
              // console.log('langding: %s, origin: %s, countX: %s, countY: %s, children: %s', landing, origin, countX, countY, area.childNodes.length)
              if (countX >= this.row) return
              if (landing >= 0 && landing < area.childNodes.length && origin !== -1) {
                // console.log(origin)
                if (landing < origin) {
                  area.insertBefore(ele, area.childNodes[landing])
                  this.setWebsitesPostion(area, landing, origin)
                } else {
                  area.insertBefore(ele, area.childNodes[landing + 1])
                  this.setWebsitesPostion(area, origin, landing)
                }
              } else if (landing >= area.childNodes.length && landing < 5 * (countY + 1) && origin !== -1) {
                area.appendChild(ele)
                // console.log('append', area.childNodes.length, origin)
                this.setWebsitesPostion(area, origin)
              }
              if (this.state.isClassified) {
                // console.log(landing, 5 * Math.ceil(area.childNodes.length / 5))
                let moved
                if (landing < 0 && area.parentNode.previousSibling) {
                  // console.log(area.childNodes.length, Math.ceil(area.childNodes.length / this.row) * (this.websiteHeight + this.spacingY) - this.spacingY + this.margin*2 + 'px')
                  // area.parentNode.style.height = Math.ceil(area.childNodes.length / this.row) * (this.websiteHeight + this.spacingY) - this.spacingY + this.margin*2 + 'px'
                  cacheArea = area
                  area = area.parentNode.previousSibling.querySelector('.classification-area')
                  moved = -1
                  // console.log('previous', area)
                } else if (landing >= 5 * Math.ceil(area.childNodes.length / 5) && area.parentNode.nextSibling) {
                  // this.setWebsitesPostion(area, 0)
                  // console.log(area.childNodes.length, Math.ceil(area.childNodes.length / this.row) * (this.websiteHeight + this.spacingY) - this.spacingY + this.margin*2 + 'px')
                  // area.parentNode.style.height = Math.ceil(area.childNodes.length / this.row) * (this.websiteHeight + this.spacingY) - this.spacingY + this.margin*2 + 'px'
                  cacheArea = area
                  area = area.parentNode.nextSibling.querySelector('.classification-area')
                  moved = 1
                  // console.log('next', area)
                }
                if (moved) {
                  if (!area.childNodes.length) {
                    area.parentNode.classList.remove('empty')
                    area.appendChild(ele)
                    this.setWebsitesPostion(area, 0)
                  } else {
                    if (moved === 1) {
                      // console.log('moved next', countX)
                      if (countX > area.childNodes.length - 1) {
                        area.appendChild(ele)
                        this.setWebsitesPostion(area, countX)
                      } else {
                        area.insertBefore(ele, area.childNodes[countX])
                        this.setWebsitesPostion(area, countX)
                      }
                    } else {
                      if (countX > (area.childNodes.length % this.row) - 1) {
                        area.appendChild(ele)
                        this.setWebsitesPostion(area, 0)
                      } else {
                        const index = Math.floor(area.childNodes.length / this.row) * this.row + countX
                        // console.log(index)
                        area.insertBefore(ele, area.childNodes[index])
                        this.setWebsitesPostion(area, index)
                      }
                    }
                  }
                  if (area !== cacheArea) {
                    this.calcWrapHeight(area)
                  }
                  // console.log('cacheArea', cacheArea)
                  if (cacheArea !== originArea) {
                    this.setWebsitesPostion(cacheArea, 0)
                    this.calcWrapHeight(cacheArea)
                    // cacheArea = area
                  }
                }
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
            const { updatePosition } = this.props
            const index = Array.prototype.indexOf.call(area.childNodes, ele)
            if (originArea === area) {
              if (area.childNodes.length !== total) {
                area.insertBefore(ele, area.childNodes[origin])
                this.setWebsitesPostion(area, origin)
              } else {
                // console.log(origin)
                // console.log('new pos: %s', index)
                if (!this.state.isClassified) {
                  updatePosition(origin, index)
                } else {
                  updatePosition(origin, index, originArea, null, wrap)
                }
              }
            }
            if (originArea !== area) {
              if (Array.prototype.indexOf.call(area.childNodes, ele) === -1) {
                originArea.insertBefore(ele, originArea.childNodes[origin])
              } else {
                this.props.updatePosition(origin, index, originArea, area, wrap)
              }
              this.setWebsitesPostion(originArea, 0)
              this.calcWrapHeight(originArea)
              this.setWebsitesPostion(area, 0)
              this.calcWrapHeight(area)
            }
            // update interface
            this.setState({
              r: Math.random()
            })
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
      // remove mousemove on ele
      const mouseUp = e => {
        ele.removeEventListener('mousemove', mouseMove)
        document.removeEventListener('mouseup', mouseUp, false)
      }
      document.addEventListener('mouseup', mouseUp, false)
    }
  }
  setWebsitesPostion = (area, start, end = area.childNodes.length - 1) => {
    // const area = this.refs.area
    for (let i = start; i <= end; i++) {
      // console.log(area.childNodes[i])
      // area.childNodes[i].style.transform = `translate(${15 + (i%5)*150 + 30*(i%5)}px, ${Math.floor(i/5)*15 + Math.floor(i/5)*36}px)`
      area.childNodes[i].style.transform = `translate(${this.margin + (i % this.row) * (this.websiteWidth + this.spacingX)}px, ${Math.floor(i / this.row) * (this.websiteHeight + this.spacingY)}px)`
    }
  }
  calcWrapHeight = (area) => {
    area.parentNode.style.height = Math.ceil(area.childNodes.length / this.row) * (this.websiteHeight + this.spacingY) - this.spacingY + this.margin + 'px'
    if (!area.childNodes.length) {
      area.parentNode.classList.add('empty')
    }
  }
  changeClassificationName = (e, index) => {
    // console.log(e.target, index)
    const { changeClassificationName, classifiedStore } = this.props
    const value = e.target.value.trim()
    if (value && value !== classifiedStore[index].name && value !== 'unclassified') {
      changeClassificationName(index, value)
    }
  }
  imgError(e) {
    e.target.src = require('./images/favicon-default.svg')
  }
  render() {
    const { intl } = this.context
    const { store, classifiedStore, isEmpty, muiTheme, settings } = this.props
    const { edit, dialog, confirm, classifyDialog, snackbarOpen, snackbarMessage, deleteOpen, deleteMessage, name, link, cIndex, isClassified} = this.state
    const target = settings.linkTarget ? '_blank' : '_self'
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
    const addClassifyActions = [
      <FlatButton
        label={intl.formatMessage({ id: 'button.cancel' })}
        primary={true}
        onTouchTap={this.hideClassifyDialog}
      />,
      <FlatButton
        label={intl.formatMessage({ id: 'button.confirm' })}
        primary={true}
        onTouchTap={this.addClassify}
      />
    ]
    return (
      <Paper zDepth={0} className="navigation-box">
        <div className="tool-bar">
          <div className={classNames('tool-area', { 'hide': !edit })}>
            {isClassified && (classifiedStore.length < classificationMax) && (
              <FlatButton
                label={intl.formatMessage({ id: 'nav.increase.classification.btn' })}
                icon={<ContentAdd />}
                onTouchTap={this.openClassifyDialog}
              />
            )}
            <Checkbox
              label={intl.formatMessage({ id: 'nav.show.classification' })}
              style={style.classifyCheckbox}
              labelStyle={style.classifyCheckboxLabel}
              defaultChecked={isClassified}
              onCheck={this.isClassified}
              labelStyle={{ width: 'auto' }}
            />
          </div>
        </div>
        <div className={classNames('websites-wrap', { 'empty': isEmpty })}>
          {isEmpty && (
            <div className="empty-box">
              <p className="empty-text">{intl.formatMessage({ id: 'empty.text.navigation' })}</p>
              <RaisedButton
                label={intl.formatMessage({ id: 'empty.text.navigation.add' })}
                primary={true}
                onTouchTap={this.openDialog}
              />
            </div>
          )}
          {!isClassified && (
            <div className="websites-area">
              {store.map((value, index) => {
                const { name, link } = value
                return (
                  <div
                    className={classNames('website-box', { 'grabable': edit })}
                    aria-grabbed="false"
                    key={Math.random()}
                    style={{ transform: `translate(${this.margin + (index % this.row) * (this.websiteWidth + this.spacingX)}px, ${Math.floor(index / this.row) * (this.websiteHeight + this.spacingY)}px)` }}
                    onMouseDown={this.beginGrab}
                  >
                    <FlatButton
                      label={name}
                      href={link}
                      target={target}
                      icon={<img className="favicon" src={`https://www.google.com/s2/favicons?domain=${link.replace(/http(s)?:\/\//, '')}`} alt={name} onError={this.imgError} />}
                      className="website-link"
                      style={style.website}
                      onClick={this.checkClick}
                    />
                    <i className={classNames('handle-btn edit-btn', { 'show': edit })} onTouchTap={e => {this.handleEdit(index, name, link)}}>
                      <ModeEdit
                        color={grey500}
                        hoverColor={grey600}
                        style={style.editHandleIcon}
                      />
                    </i>
                    <i className={classNames('handle-btn delete-btn', { 'show': edit })} onTouchTap={e => {this.handleDelete(name, index)}}>
                      <ContentClear
                        color="#fff"
                        style={style.deleteHandleIcon}
                      />
                    </i>
                    {/*<span style={{ display: 'block', width: 150, height: 36 }}>{value.name}</span>*/}
                  </div>
                )
              })}
            </div>
          )}
          {isClassified && classifiedStore.map((item, cIndex) => {
            return (
              <div
                key={Math.random()}
                className={classNames('classification', { 'empty': !item.set.length, 'editing': edit })}
                style={{ minHeight: this.margin + this.websiteHeight, height: Math.ceil(item.set.length / this.row) * (this.websiteHeight + this.spacingY) }}
              >
                <div className="classification-name" style={{ color: muiTheme.palette.primary1Color }}>
                  {edit && item.name !== 'unclassified' && (
                    <TextField
                      hintText={intl.formatMessage({ id: 'nav.edit.input.website' })}
                      defaultValue={item.name}
                      fullWidth={true}
                      style={style.classficationInput}
                      hintStyle={style.classficationHintText}
                      onBlur={e => { this.changeClassificationName(e, cIndex) }}
                    />
                  )}
                  {(!edit && item.name !== 'unclassified') && (
                    <p>{item.name}</p>
                  )}
                  {(item.name === 'unclassified') && (
                    <p>{intl.formatMessage({ id: 'nav.classification.unclassified' })}</p>
                  )}
                </div>
                <div className="classification-area" style={{ width: this.wrapperWidth }}>
                  {item.set.map((value, index) => {
                    const { name, link } = value
                    return (
                      <div
                        className={classNames('website-box', { 'grabable': edit })}
                        aria-grabbed="false"
                        key={Math.random()}
                        style={{ transform: `translate(${this.margin + (index % this.row) * (this.websiteWidth + this.spacingX)}px, ${Math.floor(index / this.row) * (this.websiteHeight + this.spacingY)}px)` }}
                        onMouseDown={this.beginGrab}
                      >
                        <FlatButton
                          label={name}
                          href={link}
                          target={target}
                          icon={<img className="favicon" src={`https://www.google.com/s2/favicons?domain=${link.replace(/http(s)?:\/\//, '')}`} alt={name} onError={this.imgError} />}
                          className="website-link"
                          style={style.website}
                          onClick={this.checkClick}
                        />
                        <i className={classNames('handle-btn edit-btn', { 'show': edit })} onTouchTap={e => {this.handleEdit(index, name, link, cIndex)}}>
                          <ModeEdit
                            color={grey500}
                            hoverColor={grey600}
                            style={style.editHandleIcon}
                          />
                        </i>
                        <i className={classNames('handle-btn delete-btn', { 'show': edit })} onTouchTap={e => {this.handleDelete(name, index, cIndex)}}>
                          <ContentClear
                            color="#fff"
                            style={style.deleteHandleIcon}
                          />
                        </i>
                      </div>
                    )
                  })}
                </div>
                {item.name !== 'unclassified' && (
                  <FlatButton
                    label={intl.formatMessage({ id: 'nav.delete.classification' })}
                    icon={<ContentClear />}
                    onTouchTap={e => { this.deleteClassification(cIndex) }}
                    className="delete-classification"
                  />
                )}
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
        {!isEmpty && store.length !== 0 && (
          <div className="float-actions" onMouseLeave={this.hideEditBtn}>
            <div className="edit-float-btn" ref="editFloatBtn" style={style.editActionButton}>
              <FloatingActionButton
                mini={true}
                onTouchTap={this.startEdit}
                backgroundColor={muiTheme.paper.backgroundColor}
                iconStyle={{ fill: muiTheme.palette.textColor }}
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
        )}
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
          /><br />
          <TextField
            floatingLabelText={intl.formatMessage({ id: 'nav.edit.input.URL' })}
            defaultValue={link}
            style={style.textField}
            onChange={this.linkChange}
          /><br />
          {isClassified && !edit && (
            <SelectField
              floatingLabelText={intl.formatMessage({ id: 'nav.add.choose.classification' })}
              value={cIndex}
              fullWidth={true}
              onChange={this.classifyChange}
            >
              {classifiedStore.map((cla, index) => {
                return (
                  <MenuItem
                    key={index}
                    value={index}
                    primaryText={cla.name !== 'unclassified' ? cla.name : intl.formatMessage({ id: 'nav.classification.unclassified' })}
                  />
                )
              })}
            </SelectField>
          )}
        </Dialog>
        <Dialog
          title={intl.formatMessage({ id: 'nav.increase.classification.title' })}
          actions={addClassifyActions}
          modal={false}
          open={classifyDialog}
          onRequestClose={this.hideClassifyDialog}
          contentStyle={style.dialogContent}
          titleStyle={style.dialogTitle}
        >
          <TextField
            floatingLabelText={intl.formatMessage({ id: 'nav.increase.classification.label' })}
            style={style.textField}
            /*onChange={this.linkChange}*/
            ref="classificationName"
          />
        </Dialog>
        <Snackbar
          open={snackbarOpen}
          message={snackbarMessage}
          autoHideDuration={2000}
          onRequestClose={this.closeSnackerbar}
        />
        <Snackbar
          open={deleteOpen}
          message={deleteMessage}
          action={intl.formatMessage({ id: 'nav.delete.undo' })}
          autoHideDuration={2000}
          onRequestClose={this.closeDelete}
          onActionTouchTap={this.undoDelete}
        />
      </Paper>
    )
  }
}

const mapStateToProps = state => {
  const { store, classifiedStore, isEmpty } = state.websites
  const { settings } = state
  return {
    store,
    classifiedStore,
    isEmpty,
    settings
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    ...websitesActions,
    ...settingsActions,
  }, dispatch)
}

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(Navigation))
