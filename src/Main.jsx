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

import { messages } from './configs'

const renderApp = (Component = App) => {
  render((
    <IntlProvider
      locale={'en-US'}
      messages={messages}
    >
      <Provider store={store}>
          <AppContainer>
            <Component />
          </AppContainer>
      </Provider>
    </IntlProvider>
  ), document.querySelector('#app'))
}

renderApp()

if (module.hot) {
  module.hot.accept('./modules/App', () => { renderApp() })
}