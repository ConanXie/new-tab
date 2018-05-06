import { observable, computed } from "mobx"
import { createMuiTheme } from "material-ui"

const themeColor = localStorage.getItem("theme") || "#3F51B5"

export class Settings {
  @observable public themeColor = themeColor
  @computed get theme() {
    const color = this.themeColor
    localStorage.setItem("theme", color)
    return Settings.createTheme(color)
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

export default new Settings()
