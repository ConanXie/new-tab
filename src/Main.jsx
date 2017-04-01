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
import reducer from './reducers'
const store = createStore(reducer, applyMiddleware(thunk))

import { IntlProvider } from 'react-intl'

import { AppContainer } from 'react-hot-loader'
import App from './modules/App'

import { messages } from './config'

render((
  <IntlProvider
    locale={'en-US'}
    messages={messages}
  >
    <Provider store={store}>
        <AppContainer>
          <App />
        </AppContainer>
    </Provider>
  </IntlProvider>
), document.querySelector('#app'))

if (module.hot) {
  module.hot.accept('./modules/App', () => {
    const NextApp = require('./modules/App').default
    render((
      <IntlProvider
        locale={'en-US'}
        messages={messages}
      >
        <Provider store={store}>
          <AppContainer>
            <NextApp />
          </AppContainer>
        </Provider>
      </IntlProvider>
    ), document.querySelector('#app'))
  })
}