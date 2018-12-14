import * as React from "react"
import { render } from "react-dom"
import { AppContainer } from "react-hot-loader"
import { Provider } from "mobx-react"
import "typeface-roboto"
import "../../styles"
import "./styles"

import App from "./App"
import * as stores from "./stores"

const renderApp = () => {
  render((
    <AppContainer>
      <Provider {...stores}>
        <App />
      </Provider>
    </AppContainer>
  ), document.querySelector("#app"))
}

renderApp()

if (module.hot) {
  module.hot.accept("./App", () => renderApp())
}
