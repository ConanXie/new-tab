import React, { Component, PropTypes } from 'react'

class Fourth extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="step step-four">
        <div className="illustration"></div>
        <h1>书签</h1>
        <p>这是一个简易的书签浏览功能，你可以选择保存书签位置。提供了书签搜索功能，方便你最快速地找到你的书签。</p>
      </div>
    )
  }
}

export default Fourth