import * as React from "react"
import { observer, inject } from "mobx-react"

import { MuiThemeProvider } from "material-ui/styles"
import CssBaseline from "material-ui/CssBaseline"

import Layout from "./Layout"

import makeDumbProps from "utils/makeDumbProps"
import { Theme as ThemeSettings } from "stores/theme"
interface PropsType {
  themeSettings: ThemeSettings
}

@inject("themeSettings")
@observer
class App extends React.Component<PropsType> {
  public render() {
    return (
      <MuiThemeProvider theme={this.props.themeSettings.theme}>
        <CssBaseline />
        <Layout />
      </MuiThemeProvider>
    )
  }
}

export default makeDumbProps(App)
