import React, { Component, PropTypes } from 'react'

class Second extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="step step-two">
        <div className="illustration"></div>
        <h1>搜索</h1>
        <p>这里有多款主流搜索引擎供你选择，鼠标移动至 LOGO 处可随时切换。你可以开启搜索预测，让搜索更加便捷。</p>
      </div>
    )
  }
}

export default Second