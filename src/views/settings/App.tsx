import * as React from "react"
import { observer, inject } from "mobx-react"

import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"

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
        <Layout />
      </MuiThemeProvider>
    )
  }
}

export default makeDumbProps(App)
