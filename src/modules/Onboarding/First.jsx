import React, { Component, PropTypes } from 'react'

class First extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="step step-one">
        <div className="illustration"></div>
        <h1>网站</h1>
        <p>你可以在主页添加你喜欢的网站。分类功能让你更快捷地点击某个网站。你可以随时编辑，删除它们，还能够拖动它们来放置到合适的位置。</p>
      </div>
    )
  }
}

export default First