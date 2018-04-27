import * as React from "react"

import { MuiThemeProvider, createMuiTheme } from "material-ui/styles"
import Button from "material-ui/Button"

import Header from "./components/Header"
import ColorPicker from "../../components/ColorPicker"

export default class extends React.Component {
  private defaultColor = "#3F51B5"
  public state = {
    color: this.defaultColor,
    open: false,
    theme: this.createTheme(this.defaultColor)
  }
  private createTheme(color: string) {
    return createMuiTheme({
      palette: {
        primary: {
          main: color
        }
      }
    })
  }
  private applyTheme(color: string) {
    const theme = this.createTheme(color)
    this.setState({ theme })
  }
  private openColorPicker = () => {
    this.setState({ open: true })
  }
  private closeColorPicker = (color?: string) => {
    this.setState({ open: false })

    if (color) {
      this.applyTheme(color)
    }
  }
  public render() {
    return (
      <MuiThemeProvider theme={this.state.theme}>
        <Header />
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <Button variant="raised" color="primary" onClick={this.openColorPicker}>Color</Button>
        <br/>
        <br/>
        <Button variant="raised" color="secondary">secondary</Button>
        <ColorPicker color={this.state.color} open={this.state.open} onClose={this.closeColorPicker} />
      </MuiThemeProvider>
    )
  }
}
