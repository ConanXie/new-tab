import * as React from "react"
import { observer, inject } from "mobx-react"

import { MuiThemeProvider } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"

import Layout from "./Layout"

import makeDumbProps from "utils/makeDumbProps"
import { ThemeStore } from "stores/theme"
interface PropsType {
  themeStore: ThemeStore
}

@inject("themeStore")
@observer
class App extends React.Component<PropsType> {
  public render() {
    return (
      <MuiThemeProvider theme={this.props.themeStore.theme}>
        <CssBaseline />
        <Layout />
      </MuiThemeProvider>
    )
  }
}

export default makeDumbProps(App)
