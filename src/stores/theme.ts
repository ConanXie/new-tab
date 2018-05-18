import { observable, computed, autorun } from "mobx"
import { createMuiTheme } from "@material-ui/core"
import { settingsStorage } from "utils/storage"

const defaultData = {
  color: "#FF5722"
}

export class ThemeStore {
  @observable public color: string
  constructor() {
    const persistence = settingsStorage.get("theme", {})
    const { color } = persistence
    this.color = color || defaultData.color
  }
  @computed get theme() {
    return ThemeStore.createTheme(this.color)
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

const themeStore = new ThemeStore()

autorun(() => {
  settingsStorage.set("theme", themeStore)
})

export default themeStore
