import './styles'

import React, { Component } from 'react'
import { render } from 'react-dom'

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import reducer from './reducers'
const store = createStore(reducer, applyMiddleware(thunk))

import { AppContainer } from 'react-hot-loader'
import App from './modules/App'

const renderApp = (Component = App) => render((
  <Provider store={store}>
    <AppContainer>
      <Component />
    </AppContainer>
  </Provider>
), document.querySelector('#app'))

renderApp()

if (module.hot) {
  module.hot.accept('./modules/App', () => renderApp())
}
