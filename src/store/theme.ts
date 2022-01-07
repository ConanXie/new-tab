import { autorun, toJS, makeAutoObservable, runInAction } from "mobx"
import { settingsStorage } from "utils/storage"
import Color from "color"
import { createTheme, ThemeOptions, Theme } from "@mui/material/styles"
import deepOrange from "@mui/material/colors/deepOrange"
import isWithinInterval from "date-fns/isWithinInterval"
import format from "date-fns/format"
import isValid from "date-fns/isValid"
import isBefore from "date-fns/isBefore"

export enum NightModeStatus {
  Off = "Off",
  On = "On",
  Custom = "Custom",
  BasedOnSystem = "BasedOnSystem",
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
  {
    status: NightModeStatus.BasedOnSystem,
    text: chrome.i18n.getMessage("settings_night_mode_based"),
  },
]

const defaultData = {
  color: deepOrange[500],
  whiteToolbar: false,
  nightMode: NightModeStatus.BasedOnSystem,
  nightTime: ["18:30", "5:00"],
}

const darkSchemeMedia = window.matchMedia("(prefers-color-scheme: dark)")

const detectColorScheme = (e: MediaQueryListEvent) => {
  themeStore.setSystemDark(e.matches)
}

export class ThemeStore {
  color: string
  nightMode: NightModeStatus
  nightTime: string[]
  isSystemDark: boolean

  constructor() {
    const persistence = settingsStorage.get("theme", {})
    const { color, nightMode, nightTime } = persistence
    this.color = color || defaultData.color
    this.nightMode = nightMode || defaultData.nightMode
    this.nightTime = nightTime || defaultData.nightTime
    this.isSystemDark = darkSchemeMedia.matches

    makeAutoObservable(this, {}, { autoBind: true })
  }

  get theme(): Theme {
    return ThemeStore.createTheme(this)
  }

  get applyNightMode(): boolean {
    if (this.nightMode !== NightModeStatus.BasedOnSystem) {
      darkSchemeMedia.removeEventListener("change", detectColorScheme)
    }
    switch (this.nightMode) {
      case NightModeStatus.On:
        return true
      case NightModeStatus.Custom: {
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
      case NightModeStatus.BasedOnSystem:
        darkSchemeMedia.addEventListener("change", detectColorScheme)
        runInAction(() => {
          this.setSystemDark(darkSchemeMedia.matches)
        })
        return darkSchemeMedia.matches
      case NightModeStatus.Off:
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

  setSystemDark(isSystemDark: boolean): void {
    this.isSystemDark = isSystemDark
  }

  private static createTheme(settings: ThemeStore) {
    const { color, applyNightMode, nightMode, isSystemDark } = settings
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
        mode:
          (nightMode === NightModeStatus.BasedOnSystem && isSystemDark) ||
          (nightMode !== NightModeStatus.BasedOnSystem && applyNightMode)
            ? "dark"
            : "light",
        primary: {
          dark: color,
          light: color,
          main: color,
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            textPrimary: {
              color: isLight ? `${colorTool.darken(lightDiff * 0.08)}` : color,
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            rounded: "border-radius: 16px",
          },
        },
        MuiMenuItem: {
          styleOverrides: {
            root: "padding-top: 8px; padding-bottom: 8px;",
          },
        },
      },
    }

    return createTheme(themeOptions)
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
