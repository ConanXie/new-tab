import { autorun, toJS, makeAutoObservable, runInAction } from "mobx"
import { settingsStorage } from "utils/storage"
import { createTheme, ThemeOptions, Theme } from "@mui/material/styles"
import deepOrange from "@mui/material/colors/deepOrange"
import { PaletteMode } from "@mui/material"
import isWithinInterval from "date-fns/isWithinInterval"
import format from "date-fns/format"
import isValid from "date-fns/isValid"
import isBefore from "date-fns/isBefore"
import {
  createColorScheme,
  DEFAULT_VIEWING_CONDITIONS,
  DynamicColorScheme,
} from "@monet-color/theme"
import { getPalette } from "@monet-color/palette"

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

export enum ThemeSource {
  Wallpaper = "Wallpaper",
  Custom = "Custom",
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
  themeSource: ThemeSource.Custom,
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
  themeSource: ThemeSource
  wallpaperPalette: string[]
  customColor: string

  constructor() {
    const persistence = settingsStorage.get("theme", {})
    const { color, nightMode, nightTime, themeSource, wallpaperPalette, customColor } = persistence
    this.color = color || defaultData.color
    this.nightMode = nightMode || defaultData.nightMode
    this.nightTime = nightTime || defaultData.nightTime
    this.themeSource = themeSource || defaultData.themeSource
    this.wallpaperPalette = wallpaperPalette || []
    this.customColor = customColor || defaultData.color
    this.isSystemDark = darkSchemeMedia.matches

    makeAutoObservable(this, {}, { autoBind: true })
  }

  get scheme() {
    console.log(this.color)
    const scheme = createColorScheme(this.color.toLowerCase())
    console.log(scheme)

    ThemeStore.setColorSchemeProperties(scheme)

    return scheme
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

  applyThemeColor(color: string): void {
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

  changeThemeSource(source: ThemeSource | null): void {
    if (source) {
      this.themeSource = source
      if (source == ThemeSource.Custom) {
        this.applyThemeColor(this.customColor)
      } else if (source == ThemeSource.Wallpaper) {
        this.applyThemeColor(this.wallpaperPalette[0])
      }
    }
  }

  saveCustomColor(color: string): void {
    if (color != this.customColor) {
      this.customColor = color
      this.applyThemeColor(color)
    }
  }

  setWallpaperPalette(colors: string[]) {
    this.wallpaperPalette = colors
    if (this.themeSource == ThemeSource.Wallpaper) {
      this.applyThemeColor(this.wallpaperPalette[0])
    }
  }

  getPaletteFromWallpaper(url: string): void {
    setTimeout(() => {
      const img = new Image()
      img.src = url
      img.onload = () => {
        const colors = getPalette(img, DEFAULT_VIEWING_CONDITIONS)
        this.setWallpaperPalette(colors)
      }
    })
  }

  private static setColorSchemeProperties(scheme: DynamicColorScheme) {
    scheme.accent1.forEach((color, weight) => {
      document.documentElement.style.setProperty(`--accent1-${weight}`, color ?? "")
    })
    scheme.accent2.forEach((color, weight) => {
      document.documentElement.style.setProperty(`--accent2-${weight}`, color ?? "")
    })
    scheme.accent3.forEach((color, weight) => {
      document.documentElement.style.setProperty(`--accent3-${weight}`, color ?? "")
    })
    scheme.neutral1.forEach((color, weight) => {
      document.documentElement.style.setProperty(`--neutral1-${weight}`, color ?? "")
    })
    scheme.neutral2.forEach((color, weight) => {
      document.documentElement.style.setProperty(`--neutral2-${weight}`, color ?? "")
    })
  }

  private static createTheme(settings: ThemeStore) {
    const { scheme, applyNightMode, nightMode, isSystemDark } = settings

    const mode: PaletteMode =
      (nightMode === NightModeStatus.BasedOnSystem && isSystemDark) ||
      (nightMode !== NightModeStatus.BasedOnSystem && applyNightMode)
        ? "dark"
        : "light"
    const isDarkMode = mode == "dark"

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
        mode,
        primary: {
          main: isDarkMode ? scheme.accent1.get(200)! : scheme.accent1.get(500)!,
        },
        secondary: {
          main: isDarkMode ? scheme.accent3.get(500)! : scheme.accent3.get(200)!,
        },
        background: {
          paper: isDarkMode ? scheme.neutral1.get(900)! : scheme.neutral1.get(10)!,
        },
      },
      components: {
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
