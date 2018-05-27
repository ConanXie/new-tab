import './styles'

import React, {Component} from 'react'
import {render} from 'react-dom'

import {applyMiddleware, createStore} from 'redux'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux'
import reducer from './reducers'
import {AppContainer} from 'react-hot-loader'
import App from './modules/App'


let appendTitle =
    function () {
        //TODO Maybe there is another way better than?
        let title = document.createElement("title");
        title.text = chrome.i18n.getMessage("newTab");
        document.querySelector("head").appendChild(title);
    };

/**
 *
 * @type {Store<any>}
 */
const store = createStore(reducer, applyMiddleware(thunk));
/**
 * Render if is {@link App}
 *
 * @param Component
 * @returns {*}
 */
const renderApp = (Component = App) => render((
    <Provider store={store}>
        <AppContainer>
            <Component/>
        </AppContainer>
    </Provider>
), document.querySelector('#app'));

appendTitle();
renderApp();

if (module.hot) {
    module.hot.accept('./modules/App', () => renderApp())
}
