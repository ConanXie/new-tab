import React, { Component } from 'react'

class Second extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="step step-two">
        <div className="illustration"></div>
        <h1>{chrome.i18n.getMessage('onboardingSecondTitle')}</h1>
        <p>{chrome.i18n.getMessage('onboardingSecondContent')}</p>
      </div>
    )
  }
}

export default Second
