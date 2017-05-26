import React, { Component } from 'react'

class Third extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="step step-three">
        <div className="illustration"></div>
        <h1>{chrome.i18n.getMessage('onboardingThirdTitle')}</h1>
        <p>{chrome.i18n.getMessage('onboardingThirdContent')}</p>
      </div>
    )
  }
}

export default Third
