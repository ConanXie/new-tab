import { observable, computed, autorun, action } from "mobx"
import { settingsStorage } from "utils/storage"
import * as Color from "color"
import createMuiTheme, { ThemeOptions } from "@material-ui/core/styles/createMuiTheme"
import { deepOrange, grey } from "@material-ui/core/colors"

const defaultData = {
  color: deepOrange[500],
  nightMode: false,
  darkToolbar: false,
}

export class ThemeStore {
  @observable public color: string
  @observable public nightMode: boolean
  @observable public darkToolbar: boolean
  constructor() {
    const persistence = settingsStorage.get("theme", {})
    const {
      color,
      nightMode,
      darkToolbar,
    } = persistence
    this.color = color || defaultData.color
    this.nightMode = nightMode || defaultData.nightMode
    this.darkToolbar = darkToolbar || defaultData.darkToolbar
  }

  @computed get theme() {
    return ThemeStore.createTheme(this.color, this.nightMode, this.darkToolbar)
  }

  @action("save theme color")
  public saveColor = (color: string) => {
    this.color = color
  }

  @action("toggle night mode")
  public toggleNightMode = () => {
    this.nightMode = !this.nightMode
  }

  @action("toggle dark toolbar")
  public toggleDarkToolbar = () => {
    this.darkToolbar = !this.darkToolbar
  }

  private static createTheme(color: string, nightMode: boolean, darkToolbar: boolean) {
    const colorTool = Color(color).hsl().round()
    const lightDiff = colorTool["color"][2] - 90
    const isLight = lightDiff > 0 && !nightMode

    const themeOptions: ThemeOptions = {
      typography: {
        fontFamily: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Roboto",
          `"Helvetica Neue"`,
          "Arial",
          "sans-serif",
          `"Microsoft Yahei"`,
          `"Apple Color Emoji"`,
          `"Segoe UI Emoji"`,
          `"Segoe UI Symbol"`,
        ].join(","),
      },
      palette: {
        type: nightMode ? "dark" : "light",
        primary: {
          main: color,
        },
      },
      overrides: {
        MuiButton: {
          root: {
            color: isLight ? `${colorTool.darken(lightDiff * 0.08)}` : color,
          },
        },
      },
    }

    if (darkToolbar && nightMode) {
      themeOptions.overrides!.MuiAppBar = {
        colorPrimary: {
          backgroundColor: grey[800],
          color: grey[50]
        },
      }
    }

    return createMuiTheme(themeOptions)
  }
}

const themeStore = new ThemeStore()

autorun(() => {
  settingsStorage.set("theme", themeStore)
})

export default themeStore
