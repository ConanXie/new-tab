import { autorun, toJS, makeAutoObservable } from "mobx"
import { settingsStorage } from "utils/storage"
import Color from "color"
import createMuiTheme, { ThemeOptions, Theme } from "@material-ui/core/styles/createMuiTheme"
import deepOrange from "@material-ui/core/colors/deepOrange"
import isWithinInterval from "date-fns/isWithinInterval"
import format from "date-fns/format"
import isValid from "date-fns/isValid"
import isBefore from "date-fns/isBefore"

export enum NightModeStatus {
  Off,
  On,
  Custom,
}

export interface NightMode {
  status: NightModeStatus
  text: string
}

export const nightModeMenu: NightMode[] = [
  {
    status: NightModeStatus.On,
    text: chrome.i18n.getMessage("settings_night_mode_on"),
  },
  {
    status: NightModeStatus.Off,
    text: chrome.i18n.getMessage("settings_night_mode_off"),
  },
  {
    status: NightModeStatus.Custom,
    text: chrome.i18n.getMessage("settings_night_mode_custom"),
  },
]

const defaultData = {
  color: deepOrange[500],
  whiteToolbar: false,
  nightMode: NightModeStatus.Off,
  darkToolbar: false,
  nightTime: ["18:30", "5:00"],
}

export class ThemeStore {
  color: string
  nightMode: NightModeStatus
  nightTime: string[]

  constructor() {
    const persistence = settingsStorage.get("theme", {})
    const { color, nightMode, nightTime } = persistence
    this.color = color || defaultData.color
    this.nightMode = nightMode || defaultData.nightMode
    this.nightTime = nightTime || defaultData.nightTime

    makeAutoObservable(this, {}, { autoBind: true })
  }

  get theme(): Theme {
    return ThemeStore.createTheme(this)
  }

  get applyNightMode(): boolean {
    switch (this.nightMode) {
      case 1:
        return true
      case 2: {
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
      }
      case 0:
      default:
        return false
    }
  }

  get nightModeText(): string {
    return nightModeMenu.find((item) => item.status === this.nightMode)!.text
  }

  saveColor(color: string): void {
    this.color = color
  }

  changeNightMode(mode: NightModeStatus): void {
    this.nightMode = mode
  }

  setNightTime(nightTime: string[]): void {
    this.nightTime = nightTime
  }

  private static createTheme(settings: ThemeStore) {
    const { color, applyNightMode } = settings
    const colorTool = Color(color).hsl().round()
    const lightDiff = (colorTool as any)["color"][2] - 90
    const isLight = lightDiff > 0 && !applyNightMode

    const themeOptions: ThemeOptions = {
      typography: {
        fontFamily: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Roboto",
          "Arial",
          "sans-serif",
          `"Apple Color Emoji"`,
          `"Segoe UI Emoji"`,
          `"Segoe UI Symbol"`,
        ].join(","),
      },
      palette: {
        type: applyNightMode ? "dark" : "light",
        primary: {
          main: color,
        },
      },
      overrides: {
        MuiButton: {
          textPrimary: {
            color: isLight ? `${colorTool.darken(lightDiff * 0.08)}` : color,
          },
        },
        MuiPaper: {
          rounded: {
            borderRadius: 16,
          },
        },
      },
    }

    return createMuiTheme(themeOptions)
  }
}

const themeStore = new ThemeStore()

let firstrun = true

autorun(() => {
  const data = toJS(themeStore)
  if (firstrun) {
    firstrun = false
  } else {
    settingsStorage.set("theme", data)
  }
})

export default themeStore
