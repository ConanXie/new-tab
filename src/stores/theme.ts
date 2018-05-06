import { observable, computed } from "mobx"
import { createMuiTheme } from "material-ui"

export class Theme {
  @observable public themeColor = localStorage.getItem("theme") || "#3F51B5"
  @computed get theme() {
    const color = this.themeColor
    localStorage.setItem("theme", color)
    return Theme.createTheme(color)
  }
  private static createTheme(color: string) {
    return createMuiTheme({
      palette: {
        primary: {
          main: color
        }
      }
    })
  }
}

export default new Theme()
