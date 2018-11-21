import { observable, computed, autorun, action } from "mobx"
import { settingsStorage } from "utils/storage"
import * as Color from "color"
import createMuiTheme, { ThemeOptions } from "@material-ui/core/styles/createMuiTheme"
import deepOrange from "@material-ui/core/colors/deepOrange"
import grey from "@material-ui/core/colors/grey"
import {
  isWithinInterval,
  format,
  isValid,
  isBefore,
} from "date-fns"
/* import isWithinInterval from "date-fns/isWithinInterval"
import format from "date-fns/format"
import isValid from "date-fns/isValid"
import isBefore from "date-fns/isBefore" */

export type ModeType = 0 | 1 | 2

export interface NightMode {
  status: ModeType
  text: string
}

export const nightModeStatus: NightMode[] = [{
  status: 1,
  text: chrome.i18n.getMessage("settings_night_mode_on"),
}, {
  status: 0,
  text: chrome.i18n.getMessage("settings_night_mode_off"),
}, {
  status: 2,
  text: chrome.i18n.getMessage("settings_night_mode_custom"),
}]

const defaultData = {
  color: deepOrange[500],
  whiteToolbar: false,
  nightMode: 0,
  darkToolbar: false,
  nightTime: [
    "18:30",
    "5:00",
  ],
}

export class ThemeStore {
  @observable public color: string
  @observable public whiteToolbar: boolean
  @observable public nightMode: ModeType
  @observable public nightTime: string[]
  @observable public darkToolbar: boolean
  constructor() {
    const persistence = settingsStorage.get("theme", {})
    const {
      color,
      whiteToolbar,
      nightMode,
      nightTime,
      darkToolbar,
    } = persistence
    this.color = color || defaultData.color
    this.whiteToolbar = whiteToolbar || defaultData.whiteToolbar
    this.nightMode = nightMode || defaultData.nightMode
    this.nightTime = nightTime || defaultData.nightTime
    this.darkToolbar = darkToolbar || defaultData.darkToolbar
  }

  @computed get theme() {
    return ThemeStore.createTheme(this)
  }

  @computed get applyNightMode(): boolean {
    switch (this.nightMode) {
      case 1:
        return true
      case 2:
        const now = new Date()
        const date = format(now, "yyyy/MM/dd")
        const start = new Date(`${date} ${this.nightTime[0]}:00`)
        const end = new Date(`${date} ${this.nightTime[1]}:00`)
        if (!isValid(start) || !isValid(end)) {
          return false
        }
        const inSameDay = isBefore(start, end)
        if (inSameDay) {
          return isWithinInterval(now, { start, end })
        } else {
          return !isWithinInterval(now, { start: end, end: start })
        }
      case 0:
      default:
        return false
    }
  }

  @computed get nightModeText() {
    return nightModeStatus.find(item => item.status === this.nightMode)!.text
  }

  @action("save theme color")
  public saveColor = (color: string) => {
    this.color = color
  }

  @action("toggle white toolbar")
  public toggleWhiteToolbar = () => {
    this.whiteToolbar = !this.whiteToolbar
  }

  @action("change night mode")
  public changeNightMode = (mode: ModeType) => {
    this.nightMode = mode
  }

  @action("set night time")
  public setNightTime = (nightTime: string[]) => {
    this.nightTime = nightTime
  }

  @action("toggle dark toolbar")
  public toggleDarkToolbar = () => {
    this.darkToolbar = !this.darkToolbar
  }

  private static createTheme(settings: ThemeStore) {
    const {
      color,
      whiteToolbar,
      applyNightMode,
      darkToolbar,
    } = settings
    const colorTool = Color(color).hsl().round()
    const lightDiff = colorTool["color"][2] - 90
    const isLight = lightDiff > 0 && !applyNightMode

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
        useNextVariants: true,
      },
      palette: {
        type: applyNightMode ? "dark" : "light",
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

    if (whiteToolbar) {
      themeOptions.overrides!.MuiAppBar = {
        colorPrimary: {
          backgroundColor: "#fff",
          color: grey[800]
        },
      }
    }

    if (applyNightMode && darkToolbar) {
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
