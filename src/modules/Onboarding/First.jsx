import React, { Component } from 'react'

class First extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="step step-one">
        <div className="illustration"></div>
        <h1>{chrome.i18n.getMessage('onboardingFirstTitle')}</h1>
        <p>{chrome.i18n.getMessage('onboardingFirstContent')}</p>
      </div>
    )
  }
}

export default First
