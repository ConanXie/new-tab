import { hot } from "react-hot-loader/root"
import React from "react"
import { Provider, observer } from "mobx-react"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import Layout from "./Layout"
import * as store from "./store"

const App = () => (
  <Provider {...store}>
    <MuiThemeProvider theme={store.themeStore.theme}>
      <Layout />
    </MuiThemeProvider>
  </Provider>
)

export default hot(observer(App))
