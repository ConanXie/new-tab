import { observable, computed, autorun, action, toJS } from "mobx"
import { settingsStorage } from "utils/storage"
import { sendMessage } from "utils/message"
import { toBase64 } from "utils/fileConversions"
import deepOrange from "@material-ui/core/colors/deepOrange"

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
  backgroundBrightness: 1,
}

export class WallpaperStore {
  @observable public wallpaper: string
  @observable public color: string
  @observable public useWallpaper: boolean
  @observable public wallpaperType: WallpaperType
  @observable public darkIcons: boolean
  @observable public blurRadius: number
  @observable public backgroundBrightness: number
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
    this.useWallpaper = useWallpaper === undefined ? defaultWallpaperData.useWallpaper : Boolean(useWallpaper)
    this.wallpaperType = wallpaperType || defaultWallpaperData.wallpaperType
    this.darkIcons = darkIcons === undefined ? defaultWallpaperData.darkIcons : Boolean(darkIcons)
    this.blurRadius = Number(blurRadius) ? Number(blurRadius) : defaultWallpaperData.blurRadius
    this.backgroundBrightness = Number(backgroundBrightness)
      ? Number(backgroundBrightness)
      : defaultWallpaperData.backgroundBrightness
  }
  @computed get wallpaperStyles() {
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
  @computed get maskStyles() {
    const styles: React.CSSProperties = {
      backgroundColor: `rgba(0, 0, 0, ${1 - this.backgroundBrightness})`
    }
    return styles
  }
  @computed get disabledImage() {
    return !this.useWallpaper || this.wallpaperType === WallpaperType.Color
  }
  @computed get disabledColor() {
    return !this.useWallpaper || this.wallpaperType === WallpaperType.Image
  }
  @action("wallpaper switch")
  public wallpaperSwitch = () => {
    this.useWallpaper = !this.useWallpaper
  }
  @action("update wallpaper -- image")
  public updateWallpaper = async (file: File | Blob) => {
    // Save base64 data to storage
    const base64 = await toBase64(file)
    sendMessage("saveWallpaper", base64)
  }
  @action("wallpaper updated -- image")
  public wallpaperUpdated = (url: string) => {
    this.wallpaperType = WallpaperType.Image
    this.wallpaper = url
  }
  @action("change wallpaper type")
  public changeWallpaperType = (value: number) => {
    this.wallpaperType = value
  }
  @action("handle background color change")
  public handleColorChange = (color: string) => {
    this.color = color
  }
  @action("toggle dark icons")
  public toggleDarkIcons = () => {
    this.darkIcons = !this.darkIcons
  }
  @action("handle background image blur radius change")
  public handleBlurChange = (radius: number) => {
    this.blurRadius = radius
  }
  @action("handle background image blur radius change")
  public handleBackgroundBrightnessChange = (brightness: number) => {
    this.backgroundBrightness = brightness
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
