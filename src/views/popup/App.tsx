import { hot } from "react-hot-loader/root"
import React from "react"
import { Provider, observer } from "mobx-react"

import Drawer from "./components/Drawer"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"

import * as store from "./stores"

const App = () => (
  <Provider {...store}>
    <MuiThemeProvider theme={store.themeStore.theme}>
    <Drawer />
    </MuiThemeProvider>
  </Provider>
)

export default hot(observer(App))
