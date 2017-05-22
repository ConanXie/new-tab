import './style.less'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import muiThemeable from 'material-ui/styles/muiThemeable'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import Paper from 'material-ui/Paper'
import { Tabs, Tab } from 'material-ui/Tabs'
import SwipeableViews from 'react-swipeable-views'

const style = {
  dialogContent: {
    width: '380px'
  },
  dialogBody: {
    padding: 0
  },
  dialogTitle: {
    textAlign: 'center'
  }
}

class Donate extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      dialogOpen: false
    }
  }
  showDialog = () => {
    this.setState({
      dialogOpen: true
    })
  }
  hideDialog = () => {
    this.setState({
      dialogOpen: false
    })
  }
  openDonation = () => {
    if (navigator.language !== 'zh-CN') {
      chrome.tabs.create({ url: 'https://www.paypal.me/conanxie' })
    } else {
      this.showDialog()
    }
  }
  handleChange = value => {
    this.setState({
      slideIndex: value
    })
  }
  render() {
    const { dialogOpen, slideIndex } = this.state
    const { muiTheme } = this.props
    const { intl } = this.context
    return (
      <div className="donor">
        <RaisedButton
          label={intl.formatMessage({ id: 'settings.donate' })}
          primary={true}
          onTouchTap={this.openDonation}
        />
        <Dialog
          open={dialogOpen}
          onRequestClose={this.hideDialog}
          contentStyle={style.dialogContent}
          bodyStyle={style.dialogBody}
        >
          <Paper zDepth={2}>
            <Tabs
              onChange={this.handleChange}
              value={slideIndex}
              inkBarStyle={{ backgroundColor: muiTheme.palette.alternateTextColor }}
            >
              {/*<Tab label={intl.formatMessage({ id: 'bookmarks.tabs.all' })} value={0} />*/}
              <Tab label="微信" value={0} />
              <Tab label="支付宝" value={1} />
            </Tabs>
          </Paper>
          <SwipeableViews
            index={slideIndex}
            onChangeIndex={this.handleChange}
          >
            <section>
              <img className="qrcode" src={require('./images/wechat.png')} alt="wechat" />
            </section>
            <section>
              <img className="qrcode" src={require('./images/alipay.png')} alt="alipay" />
            </section>
          </SwipeableViews>
          <p className="谢谢">如果你觉得这个扩展有用就支持我一下吧</p>
        </Dialog>
      </div>
    )
  }
}

export default muiThemeable()(Donate)
