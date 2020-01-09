import { hot } from "react-hot-loader/root"
import React from "react"
import { observer } from "mobx-react"
import { MuiThemeProvider } from "@material-ui/core/styles"
import { SnackbarProvider } from "notistack"
import Layout from "./Layout"
import { themeStore } from "./store"

const App = () => (
  <MuiThemeProvider theme={themeStore.theme}>
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
)

export default hot(observer(App))
