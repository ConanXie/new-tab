import './style.less'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'

const style = {
  dialogContent: {
    width: '380px'
  },
  dialogTitle: {
    textAlign: 'center'
  }
}

class Donor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dialog: false
    }
  }
  showDialog = () => {
    this.setState({
      dialog: true
    })
  }
  hideDialog = () => {
    this.setState({
      dialog: false
    })
  }
  render() {
    return (
      <div className="donor">
        <RaisedButton
          label="捐助"
          primary={true}
          onTouchTap={this.showDialog}
        />
        <Dialog
          title="微信扫一扫"
          open={this.state.dialog}
          onRequestClose={this.hideDialog}
          contentStyle={style.dialogContent}
          titleStyle={style.dialogTitle}
        >
          <img className="qrcode" src={require('./images/weixinpay.png')} alt="weixin" />
          <p className="谢谢">既然打开了就扫一扫捐助我吧</p>
        </Dialog>
      </div>
    )
  }
}

export default Donor