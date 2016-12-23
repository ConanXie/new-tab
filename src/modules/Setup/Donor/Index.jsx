import './style.less'

import React, { Component, PropTypes } from 'react'

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
          title="支付宝扫描二维码"
          open={this.state.dialog}
          onRequestClose={this.hideDialog}
          contentStyle={style.dialogContent}
          titleStyle={style.dialogTitle}
        >
          <img className="qrcode" src={require('./images/alipay-qrcode.png')} alt="714751364@qq.com" />
          <p className="谢谢">如果你认可我的付出就捐助我吧，多和少都是心意，谢谢</p>
        </Dialog>
      </div>
    )
  }
}

export default Donor