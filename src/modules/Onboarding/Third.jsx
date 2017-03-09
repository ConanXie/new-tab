import React, { Component, PropTypes } from 'react'

class Third extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="step step-three">
        <div className="illustration"></div>
        <h1>天气与应用</h1>
        <p>简洁美观的天气预报，前提是你允许扩展使用你的位置。你可以在这里浏览你的 Chrome 应用，点击可以启动。</p>
      </div>
    )
  }
}

export default Third