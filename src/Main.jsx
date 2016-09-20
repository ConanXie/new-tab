// import 'react-hot-loader/patch'

// less
import './less/style.less'

import React, { Component } from 'react'
import { render } from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
//Needed for onTouchTap
injectTapEventPlugin()

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

const store = createStore(() => {}, applyMiddleware(thunk))

import { AppContainer } from 'react-hot-loader'
import App from './modules/App'

render((
  <Provider store={store}>
    <AppContainer>
      <App />
    </AppContainer>
  </Provider>
), document.querySelector('#app'))

if (module.hot) {
  module.hot.accept('./modules/App', () => {
    const NextApp = require('./modules/App').default
    render((
      <Provider store={store}>
        <AppContainer>
          <NextApp />
        </AppContainer>
      </Provider>
    ), document.querySelector('#app'))
  })
}