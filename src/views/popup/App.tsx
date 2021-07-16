import { hot } from "react-hot-loader/root"
import React from "react"
import { Provider, observer } from "mobx-react"

import Drawer from "./components/Drawer"
import { ThemeProvider } from "@material-ui/core/styles"

import * as store from "./store"

const App = () => (
  <Provider {...store}>
    <ThemeProvider theme={store.themeStore.theme}>
      <Drawer />
    </ThemeProvider>
  </Provider>
)

export default hot(observer(App))
