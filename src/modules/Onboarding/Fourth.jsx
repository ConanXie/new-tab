import React, { Component } from 'react'

class Fourth extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="step step-four">
        <div className="illustration"></div>
        <h1>{chrome.i18n.getMessage('onboardingFourthTitle')}</h1>
        <p>{chrome.i18n.getMessage('onboardingFourthContent')}</p>
      </div>
    )
  }
}

export default Fourth
