import { autorun, toJS, makeAutoObservable } from "mobx"
import { settingsStorage } from "utils/storage"
import { sendMessage } from "utils/message"
import { toBase64 } from "utils/fileConversions"
import deepOrange from "@mui/material/colors/deepOrange"
import themeStore from "store/theme"

export enum WallpaperType {
  Image = 1,
  Color = 2,
}

export const defaultWallpaperData = {
  wallpaper: "",
  color: deepOrange[500],
  useWallpaper: true,
  wallpaperType: WallpaperType.Image,
  darkIcons: false,
  blurRadius: 0,
  backgroundBrightness: 100,
}

export class WallpaperStore {
  wallpaper: string
  color: string
  useWallpaper: boolean
  wallpaperType: WallpaperType
  darkIcons: boolean
  blurRadius: number
  backgroundBrightness: number
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(data: any) {
    const {
      wallpaper,
      color,
      useWallpaper,
      wallpaperType,
      darkIcons,
      blurRadius,
      backgroundBrightness,
    } = data

    this.wallpaper = wallpaper || defaultWallpaperData.wallpaper
    this.color = color || defaultWallpaperData.color
    this.useWallpaper =
      useWallpaper === undefined ? defaultWallpaperData.useWallpaper : Boolean(useWallpaper)
    this.wallpaperType = wallpaperType || defaultWallpaperData.wallpaperType
    this.darkIcons = darkIcons === undefined ? defaultWallpaperData.darkIcons : Boolean(darkIcons)
    this.blurRadius = Number(blurRadius) ? Number(blurRadius) : defaultWallpaperData.blurRadius
    this.backgroundBrightness = Number(backgroundBrightness)
      ? Number(backgroundBrightness)
      : defaultWallpaperData.backgroundBrightness

    makeAutoObservable(this, {}, { autoBind: true })
  }
  get wallpaperStyles(): React.CSSProperties {
    const styles: React.CSSProperties = {}
    if (this.useWallpaper) {
      if (this.wallpaperType === WallpaperType.Image) {
        styles.backgroundImage = `url(${this.wallpaper})`
        styles.filter = `blur(${this.blurRadius}px)`
        styles.margin = `-${this.blurRadius * 2}px`
      } else if (this.wallpaperType === WallpaperType.Color) {
        styles.backgroundColor = this.color
      }
    }
    return styles
  }
  get maskStyles(): React.CSSProperties {
    const styles: React.CSSProperties = {
      backgroundColor: `rgba(0, 0, 0, ${1 - this.backgroundBrightness / 100})`,
    }
    return styles
  }
  get disabledImage(): boolean {
    return !this.useWallpaper || this.wallpaperType === WallpaperType.Color
  }
  get disabledColor(): boolean {
    return !this.useWallpaper || this.wallpaperType === WallpaperType.Image
  }
  wallpaperSwitch(): void {
    this.useWallpaper = !this.useWallpaper
  }
  async updateWallpaper(file: File | Blob): Promise<void> {
    // Save base64 data to storage
    const base64 = await toBase64(file)
    sendMessage("saveWallpaper", base64 as string)
  }
  wallpaperUpdated(url: string): void {
    this.wallpaperType = WallpaperType.Image
    this.wallpaper = url
    themeStore.getPaletteFromWallpaper(this.wallpaper)
  }
  changeWallpaperType(value: WallpaperType): void {
    this.wallpaperType = value
    if (value == WallpaperType.Color) {
      themeStore.setWallpaperPalette([this.color])
    } else {
      themeStore.getPaletteFromWallpaper(this.wallpaper)
    }
  }
  handleColorChange(color: string): void {
    this.color = color
    themeStore.setWallpaperPalette([this.color])
  }
  toggleDarkIcons(): void {
    this.darkIcons = !this.darkIcons
  }
  handleBlurChange(radius: number | number[]): void {
    this.blurRadius = Array.isArray(radius) ? radius[0] : radius
  }
  handleBackgroundBrightnessChange(brightness: number | number[]): void {
    this.backgroundBrightness = brightness as number
  }
}

const persistence = settingsStorage.get("wallpaper", {})
const wallpaperStore = new WallpaperStore(persistence)

let firstrun = true

autorun(() => {
  const data = toJS(wallpaperStore)
  if (firstrun) {
    firstrun = false
  } else {
    settingsStorage.set("wallpaper", data)
  }
})

export default wallpaperStore
