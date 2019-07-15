import { hot } from "react-hot-loader/root"
import React from "react"
import { Provider, observer } from "mobx-react"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import { SnackbarProvider } from "notistack"
import Layout from "./Layout"
import * as store from "./store"

const App = () => (
  <Provider {...store}>
    <MuiThemeProvider theme={store.themeStore.theme}>
      <SnackbarProvider
        maxSnack={1}
        dense
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Layout />
      </SnackbarProvider>
    </MuiThemeProvider>
  </Provider>
)

export default hot(observer(App))
