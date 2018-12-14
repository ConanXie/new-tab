import * as React from "react"

import Drawer from "./components/Drawer"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"

import { ThemeStore } from "stores/theme"
import { inject, observer } from "mobx-react"
import makeDumbProps from "utils/makeDumbProps"

interface PropsType {
  themeStore: ThemeStore
}

@inject("themeStore")
@observer
class App extends React.Component<PropsType> {
  public render() {
    return (
      <MuiThemeProvider theme={this.props.themeStore.theme}>
        <Drawer />
      </MuiThemeProvider>
    )
  }
}

export default makeDumbProps(App)
