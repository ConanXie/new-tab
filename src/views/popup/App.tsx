import { hot } from "react-hot-loader/root"
import React from "react"
import { Provider } from "mobx-react"

import Drawer from "./components/Drawer"
import Theme from "components/Theme"

import * as store from "./store"

const App = () => (
  <Provider {...store}>
    <Theme>
      <Drawer />
    </Theme>
  </Provider>
)

export default hot(App)
